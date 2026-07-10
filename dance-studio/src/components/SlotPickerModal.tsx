import { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useSite } from '../lib/useSite';

interface SlotPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SlotPickerModal({ isOpen, onClose }: SlotPickerModalProps) {
  const { data } = useSite();
  const { settings } = data;
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [hour, setHour] = useState('06');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmpm] = useState('PM');

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const ampmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const isMd = window.innerWidth >= 768;
        const itemHeight = isMd ? 56 : 48;
        
        if (hourRef.current) hourRef.current.scrollTop = hours.indexOf(hour) * itemHeight;
        if (minuteRef.current) minuteRef.current.scrollTop = minutes.indexOf(minute) * itemHeight;
        if (ampmRef.current) ampmRef.current.scrollTop = periods.indexOf(ampm) * itemHeight;
      }, 50);
    }
  }, [isOpen]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>, type: 'hour' | 'minute' | 'ampm') => {
    const container = e.currentTarget;
    const isMd = window.innerWidth >= 768;
    const itemHeight = isMd ? 56 : 48;
    const scrollTop = container.scrollTop;
    
    const index = Math.round(scrollTop / itemHeight);
    
    if (type === 'hour' && hours[index]) setHour(hours[index]);
    if (type === 'minute' && minutes[index]) setMinute(minutes[index]);
    if (type === 'ampm' && periods[index]) setAmpm(periods[index]);
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = clickedDate.toDateString();
    
    if (selectedDates.some(d => d.toDateString() === dateString)) {
      setSelectedDates(selectedDates.filter(d => d.toDateString() !== dateString));
    } else {
      if (selectedDates.length < 12) {
        setSelectedDates([...selectedDates, clickedDate]);
      }
    }
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const isSelected = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
    return selectedDates.some(selected => selected.toDateString() === d);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col md:flex-row overflow-y-auto">

        <button onClick={onClose} className="absolute top-4 right-4 z-20 w-9 h-9 md:w-10 md:h-10 bg-brand-paper flex items-center justify-center text-brand-ink hover:bg-brand-pink-soft transition-colors">
          <X size={18} />
        </button>

        {/* Time Picker Section */}
        <div className="w-full md:w-1/3 bg-brand-paper p-6 md:p-10 border-b md:border-b-0 md:border-r border-brand-ink/10 flex flex-col items-center shrink-0">
          <div className="flex items-center gap-2 md:gap-3 text-brand-ink mb-6 md:mb-10">
            <Clock size={20} className="text-brand-gold md:w-6 md:h-6" />
            <h3 className="font-serif text-xl md:text-2xl">{settings.slotPickerTimeHeading || 'Select Time'}</h3>
          </div>

          <div className="flex items-center justify-center gap-1 sm:gap-2 h-48 md:h-64 relative w-full">
            {/* Selection Highlight - sits behind digits */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-12 md:h-14 bg-brand-paper/60 pointer-events-none z-0 border-t border-b border-brand-gold/40"></div>

            {/* Hours */}
            <div
              ref={hourRef}
              onScroll={(e) => handleScroll(e, 'hour')}
              className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide px-2 w-14 sm:w-16"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              <div className="h-[72px] md:h-[100px]"></div>
              {hours.map(h => (
                <div
                  key={h}
                  onClick={() => {
                    setHour(h);
                    const isMd = window.innerWidth >= 768;
                    const itemHeight = isMd ? 56 : 48;
                    if (hourRef.current) {
                      hourRef.current.scrollTo({ top: hours.indexOf(h) * itemHeight, behavior: 'smooth' });
                    }
                  }}
                  className={`h-12 md:h-14 flex items-center justify-center snap-center font-mono cursor-pointer transition-all ${hour === h ? 'text-brand-gold font-bold text-3xl md:text-4xl' : 'text-brand-muted/60 text-2xl md:text-3xl hover:text-brand-ink'}`}
                >
                  {h}
                </div>
              ))}
              <div className="h-[72px] md:h-[100px]"></div>
            </div>

            <div className="relative z-10 text-2xl md:text-3xl text-brand-muted font-mono pb-2">:</div>

            {/* Minutes */}
            <div
              ref={minuteRef}
              onScroll={(e) => handleScroll(e, 'minute')}
              className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide px-2 w-14 sm:w-16"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              <div className="h-[72px] md:h-[100px]"></div>
              {minutes.map(m => (
                <div
                  key={m}
                  onClick={() => {
                    setMinute(m);
                    const isMd = window.innerWidth >= 768;
                    const itemHeight = isMd ? 56 : 48;
                    if (minuteRef.current) {
                      minuteRef.current.scrollTo({ top: minutes.indexOf(m) * itemHeight, behavior: 'smooth' });
                    }
                  }}
                  className={`h-12 md:h-14 flex items-center justify-center snap-center font-mono cursor-pointer transition-all ${minute === m ? 'text-brand-gold font-bold text-3xl md:text-4xl' : 'text-brand-muted/60 text-2xl md:text-3xl hover:text-brand-ink'}`}
                >
                  {m}
                </div>
              ))}
              <div className="h-[72px] md:h-[100px]"></div>
            </div>

            {/* AM/PM - own column, spaced away from digits */}
            <div
              ref={ampmRef}
              onScroll={(e) => handleScroll(e, 'ampm')}
              className="relative z-10 h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide px-2 w-12 sm:w-14 ml-3 sm:ml-4"
              style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
            >
              <div className="h-[72px] md:h-[100px]"></div>
              {periods.map(p => (
                <div
                  key={p}
                  onClick={() => {
                    setAmpm(p);
                    const isMd = window.innerWidth >= 768;
                    const itemHeight = isMd ? 56 : 48;
                    if (ampmRef.current) {
                      ampmRef.current.scrollTo({ top: periods.indexOf(p) * itemHeight, behavior: 'smooth' });
                    }
                  }}
                  className={`h-12 md:h-14 flex items-center justify-center snap-center font-bold cursor-pointer transition-all ${ampm === p ? 'text-brand-gold text-xl md:text-2xl' : 'text-brand-muted/60 text-lg md:text-xl hover:text-brand-ink'}`}
                >
                  {p}
                </div>
              ))}
              <div className="h-[72px] md:h-[100px]"></div>
            </div>
          </div>
          
          <div className="mt-6 md:mt-8 text-center">
            <p className="text-brand-muted text-[10px] tracking-[0.3em] uppercase">Daily at</p>
            <p className="font-serif text-brand-ink text-2xl md:text-3xl mt-1">{hour}:{minute} {ampm}</p>
          </div>
        </div>

        {/* Calendar Section */}
        <div className="w-full md:w-2/3 p-6 md:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <h3 className="font-serif text-2xl md:text-3xl text-brand-ink">{settings.slotPickerDateHeading || 'Select Dates'}</h3>
              <div className="flex items-center justify-between sm:justify-end gap-2 md:gap-4 bg-brand-paper px-3 py-1.5 md:px-4 md:py-2">
                <button onClick={prevMonth} className="text-brand-muted hover:text-brand-ink transition-colors p-1">
                  <ChevronLeft size={18} />
                </button>
                <span className="text-brand-ink text-xs md:text-sm tracking-widest uppercase min-w-[110px] md:min-w-[130px] text-center">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>
                <button onClick={nextMonth} className="text-brand-muted hover:text-brand-ink transition-colors p-1">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-brand-muted text-[10px] md:text-xs tracking-widest uppercase font-semibold py-1 md:py-2">
                  {day}
                </div>
              ))}
              
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="p-1 md:p-2"></div>
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const selected = isSelected(day);
                const disabled = !selected && selectedDates.length >= 12;
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    disabled={disabled}
                    className={`
                      aspect-square flex items-center justify-center text-xs md:text-sm transition-all mx-auto w-8 h-8 md:w-10 md:h-10
                      ${selected
                        ? 'bg-brand-gold text-white font-semibold'
                        : disabled
                          ? 'text-brand-muted/30 cursor-not-allowed'
                          : 'text-brand-ink hover:bg-brand-pink-soft'
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-brand-ink/10 pt-6 mt-4 gap-4">
              <p className="text-brand-muted text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-widest uppercase whitespace-nowrap text-center sm:text-left">
                <span className={`font-serif text-2xl align-middle ${selectedDates.length === 12 ? 'text-brand-gold' : 'text-brand-ink'}`}>
                  {selectedDates.length}
                </span> <span className="align-middle">/ 12 days selected</span>
              </p>

              <button
                onClick={onClose}
                disabled={selectedDates.length === 0}
                className="bg-brand-gold text-white w-full sm:w-auto px-4 sm:px-8 py-3.5 text-[10px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.3em] uppercase font-semibold hover:bg-brand-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {settings.slotPickerSubmitLabel || 'Secure slots'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
