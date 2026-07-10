# ---- Frontend build ----
FROM node:22-alpine AS frontend
WORKDIR /web

COPY dance-studio/package*.json ./
RUN npm ci
COPY dance-studio/ ./
RUN npm run build

# ---- Go build ----
FROM golang:1.25.4-alpine AS backend
WORKDIR /app
RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

# Copy the backend source (everything except node_modules etc — see .dockerignore)
COPY cmd/       ./cmd/
COPY config/    ./config/
COPY internal/  ./internal/
COPY assets/    ./assets/
COPY start.sh   ./start.sh

# Drop the built SPA into the embed target BEFORE `go build`, so
# `//go:embed all:dist` in internal/fs.go picks it up at compile time.
RUN rm -rf internal/dist && mkdir -p internal/dist
COPY --from=frontend /web/dist/ ./internal/dist/

RUN CGO_ENABLED=0 GOOS=linux go build -o bin/migration cmd/migration/main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o bin/lldance_backend cmd/server/main.go

# ---- Runtime ----
FROM alpine:latest
RUN apk add --no-cache ca-certificates tzdata
WORKDIR /app

COPY --from=backend /app/bin/migration ./bin/
COPY --from=backend /app/bin/lldance_backend ./bin/
COPY --from=backend /app/start.sh ./
COPY --from=backend /app/assets ./assets

RUN chmod +x ./start.sh

ENV ASSETS_DIR=/app/assets
EXPOSE 8080

CMD ["./start.sh"]
