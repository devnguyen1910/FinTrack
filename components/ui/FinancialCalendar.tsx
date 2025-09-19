import React, { useState, useMemo } from 'react';
import { useFinancials } from '../../context/FinancialContext';
import { TransactionType } from '../../types';
import { Card } from './Card';

interface CalendarEvent {
  type: 'TRANSACTION_INCOME' | 'TRANSACTION_EXPENSE' | 'DEBT' | 'LOAN' | 'GOAL';
  description: string;
  amount?: number;
}

const EventItem: React.FC<{ event: CalendarEvent }> = ({ event }) => {
    const { formatCurrency } = useFinancials();
    const typeClasses = {
        TRANSACTION_INCOME: { bg: 'bg-secondary/20', text: 'text-secondary', label: 'Thu nhập' },
        TRANSACTION_EXPENSE: { bg: 'bg-danger/20', text: 'text-danger', label: 'Chi tiêu' },
        DEBT: { bg: 'bg-warning/20', text: 'text-warning', label: 'Đến hạn nợ' },
        LOAN: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Đáo hạn vay' },
        GOAL: { bg: 'bg-primary/20', text: 'text-primary', label: 'Mục tiêu' }
    };

    const classes = typeClasses[event.type];

    return (
        <div className={`p-2 rounded-md ${classes.bg} flex justify-between items-center`}>
            <div>
                 <p className={`font-semibold text-sm ${classes.text}`}>{classes.label}</p>
                 <p className="text-gray-800 dark:text-gray-200 text-sm">{event.description}</p>
            </div>
            {event.amount != null && (
                <p className={`font-bold text-sm ${classes.text}`}>
                    {formatCurrency(event.amount)}
                </p>
            )}
        </div>
    );
};


export const FinancialCalendar: React.FC = () => {
    const { transactions, loans, debts, goals } = useFinancials();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const eventsByDate = useMemo(() => {
        const events = new Map<string, CalendarEvent[]>();

        const addEvent = (dateStr: string, event: CalendarEvent) => {
            if (!dateStr) return;
            const dateKey = new Date(dateStr).toISOString().split('T')[0];
            if (!events.has(dateKey)) {
                events.set(dateKey, []);
            }
            events.get(dateKey)!.push(event);
        };

        transactions.forEach(t => addEvent(t.date, {
            type: t.type === TransactionType.INCOME ? 'TRANSACTION_INCOME' : 'TRANSACTION_EXPENSE',
            description: t.description,
            amount: t.amount,
        }));
        loans.forEach(l => addEvent(l.maturityDate, { type: 'LOAN', description: `Đáo hạn: ${l.name}`, amount: l.principal }));
        debts.forEach(d => addEvent(d.dueDate, { type: 'DEBT', description: `Đến hạn: ${d.name}`, amount: d.amount }));
        goals.forEach(g => {
            if (g.deadline) addEvent(g.deadline, { type: 'GOAL', description: `Deadline: ${g.name}`, amount: g.targetAmount })
        });

        return events;
    }, [transactions, loans, debts, goals]);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    const endDate = new Date(endOfMonth);
    if (endOfMonth.getDay() !== 6) {
        endDate.setDate(endDate.getDate() + (6 - endOfMonth.getDay()));
    }

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const changeMonth = (offset: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Set to first day to avoid month skipping issues
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };
    
    const selectedDateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
    const selectedDayEvents = selectedDateKey ? eventsByDate.get(selectedDateKey) || [] : [];

    return (
        <Card title="Lịch tài chính">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Tháng trước">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <h3 className="text-lg font-semibold">
                            {currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Tháng sau">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2 font-medium">
                        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => <div key={d}>{d}</div>)}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {days.map((d, i) => {
                            const dateKey = d.toISOString().split('T')[0];
                            const dayEvents = eventsByDate.get(dateKey);
                            const isToday = d.toDateString() === new Date().toDateString();
                            const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                            const isSelected = d.toDateString() === selectedDate?.toDateString();

                            return (
                                <div
                                    key={i}
                                    onClick={() => setSelectedDate(d)}
                                    className={`relative p-2 h-16 flex flex-col items-center justify-start rounded-lg cursor-pointer transition-colors
                                        ${isCurrentMonth ? 'bg-light dark:bg-dark' : 'bg-gray-100 dark:bg-gray-800/50 text-gray-400'}
                                        ${isSelected ? 'bg-primary text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}
                                        ${isToday && !isSelected ? 'ring-2 ring-primary' : ''}
                                    `}
                                >
                                    <span className={`font-medium ${isSelected ? 'text-white' : ''}`}>{d.getDate()}</span>
                                    {dayEvents && (
                                        <div className="flex flex-wrap justify-center mt-2 gap-0.5">
                                            {dayEvents.some(e => e.type === 'TRANSACTION_INCOME') && <div className="w-1.5 h-1.5 bg-secondary rounded-full" title="Thu nhập"></div>}
                                            {dayEvents.some(e => e.type === 'TRANSACTION_EXPENSE') && <div className="w-1.5 h-1.5 bg-danger rounded-full" title="Chi tiêu"></div>}
                                            {dayEvents.some(e => e.type === 'DEBT' || e.type === 'LOAN') && <div className="w-1.5 h-1.5 bg-warning rounded-full" title="Nợ/Vay"></div>}
                                            {dayEvents.some(e => e.type === 'GOAL') && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" title="Mục tiêu"></div>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-2">
                     <h4 className="font-semibold mb-2 text-center lg:text-left">
                        Sự kiện cho {selectedDate ? selectedDate.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Chưa chọn ngày'}
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                        {selectedDayEvents.length > 0 ? (
                            selectedDayEvents.map((event, i) => <EventItem key={i} event={event} />)
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-500 text-sm text-center pt-8">
                                <p>Không có sự kiện nào.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};
