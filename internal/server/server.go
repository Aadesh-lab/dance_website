package server

import (
	"context"
	"errors"
	"lldance_backend/config"
	webserver "lldance_backend/internal"
	"lldance_backend/internal/db"
	"lldance_backend/internal/middleware"
	"lldance_backend/internal/minioclient"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
)

func StartServer() {
	config.LoadConfig()
	db.ConnectToDB()
	if err := minioclient.Init(); err != nil {
		log.Printf("Warning: MinIO init failed: %v", err)
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	server := createServer()

	if err := runServer(ctx, server, 5*time.Second); err != nil {
		log.Fatal(err)
	}
}

func createServer() *http.Server {
	r := gin.New()
	r.Use(middleware.CORSMiddleware())

	r.OPTIONS("/*path", func(c *gin.Context) {
		c.AbortWithStatus(http.StatusNoContent)
	})

	r.Use(
		gin.Logger(),
		gin.Recovery(),
		middleware.IPLoggingMiddleware(),
		middleware.ErrorHandlingMiddleware(),
		middleware.RateLimiterMiddleware(),
	)

	assetsFS := getFileSystem(false)
	r.GET("/assets/*filepath", func(c *gin.Context) {
		file := strings.TrimPrefix(c.Param("filepath"), "/")

		f, err := assetsFS.Open("assets/" + file)
		if err != nil {
			c.Status(http.StatusNotFound)
			return
		}
		defer f.Close()

		stat, _ := f.Stat()
		http.ServeContent(c.Writer, c.Request, file, stat.ModTime(), f)
	})

	r.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/api/") {
			c.JSON(http.StatusNotFound, gin.H{"error": "API not found"})
			return
		}

		// Try to serve an actual file from the embedded frontend (e.g. /logo.jpeg,
		// /favicon.ico, /vite.svg). If not found, fall back to index.html so the
		// SPA router can handle the URL.
		reqPath := strings.TrimPrefix(c.Request.URL.Path, "/")
		if reqPath != "" && !strings.Contains(reqPath, "..") {
			if f, err := assetsFS.Open(reqPath); err == nil {
				defer f.Close()
				if stat, err := f.Stat(); err == nil && !stat.IsDir() {
					http.ServeContent(c.Writer, c.Request, reqPath, stat.ModTime(), f)
					return
				}
			}
		}

		f, err := assetsFS.Open("index.html")
		if err != nil {
			c.String(http.StatusInternalServerError, "index.html not found")
			return
		}
		defer f.Close()

		stat, _ := f.Stat()
		http.ServeContent(c.Writer, c.Request, "index.html", stat.ModTime(), f)
	})

	RegisterRoutes(r)

	server := &http.Server{
		Addr:    ":" + config.AppConfig.Port,
		Handler: r,
	}

	return server
}

func runServer(
	ctx context.Context,
	server *http.Server,
	shutdownTimeOut time.Duration,
) error {
	errCh := make(chan error, 1)
	go func() {
		log.Println("Server running on :" + config.AppConfig.Port)
		if err := server.ListenAndServe(); !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
		close(errCh)
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)

	select {
	case err := <-errCh:
		return err
	case <-stop:
		log.Printf("Received shutdown signal")
	case <-ctx.Done():
		log.Printf("Context canceled, shutting down")
	}

	shutDownCtx, cancel := context.WithTimeout(context.Background(), shutdownTimeOut)
	defer cancel()

	if err := server.Shutdown(shutDownCtx); err != nil {
		if closeErr := server.Close(); closeErr != nil {
			return errors.Join(err, closeErr)
		}
		return err
	}

	log.Println("Server stopped gracefully")
	return nil
}

func getFileSystem(useOS bool) http.FileSystem {
	if useOS {
		return http.FS(os.DirFS("dist"))
	}
	fsys, err := fs.Sub(webserver.DistFolder, "dist")
	if err != nil {
		panic(err)
	}
	return http.FS(fsys)
}
