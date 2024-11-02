import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DatePicker } from './date-picker';

describe('DatePicker', () => {
  const mockOnChange = vi.fn();
  const user = userEvent.setup();
  const testDate = new Date('2024-03-20');

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('기본 placeholder가 올바르게 표시됩니다', () => {
    render(<DatePicker value={undefined} onChange={mockOnChange} />);
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('사용자 지정 placeholder가 올바르게 표시됩니다', () => {
    render(
      <DatePicker 
        value={undefined} 
        onChange={mockOnChange} 
        placeholder="Select date" 
      />
    );
    expect(screen.getByText('Select date')).toBeInTheDocument();
  });

  it('선택된 날짜가 올바르게 표시됩니다', () => {
    render(<DatePicker value={testDate} onChange={mockOnChange} />);
    expect(screen.getByText('March 20th, 2024')).toBeInTheDocument();
  });

  it('캘린더가 클릭시 열립니다', async () => {
    render(<DatePicker value={undefined} onChange={mockOnChange} />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('날짜 선택시 onChange가 호출됩니다', async () => {
    render(<DatePicker value={undefined} onChange={mockOnChange} />);
    const button = screen.getByRole('button', { name: 'Pick a date' });
    await user.click(button);
    
    const dayButton = screen.getByText(/^15$/i);
    await user.click(dayButton);
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  describe('날짜 포맷', () => {
    it('기본 포맷(PPP)으로 날짜가 표시됩니다', () => {
      render(<DatePicker value={testDate} onChange={mockOnChange} />);
      expect(screen.getByText('March 20th, 2024')).toBeInTheDocument();
    });

    it('사용자 지정 포맷(yyyy-MM-dd)으로 날짜가 표시됩니다', () => {
      render(
        <DatePicker 
          value={testDate} 
          onChange={mockOnChange} 
          format="yyyy-MM-dd" 
        />
      );
      expect(screen.getByText('2024-03-20')).toBeInTheDocument();
    });

    it('사용자 지정 포맷(MM/dd/yyyy)으로 날짜가 표시됩니다', () => {
      render(
        <DatePicker 
          value={testDate} 
          onChange={mockOnChange} 
          format="MM/dd/yyyy" 
        />
      );
      expect(screen.getByText('03/20/2024')).toBeInTheDocument();
    });
  });
});
