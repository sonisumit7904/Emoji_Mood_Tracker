import React, { useEffect, useRef } from 'react';
import { Chart, registerables, ScriptableContext, Filler, ScriptableLineSegmentContext } from 'chart.js';
import { MoodEntries, MoodData } from '../types/types';
import { getMoodScore, getMoodDataByScore } from '../utils/moodUtils';
import { formatDateToString, getDaysInMonth } from '../utils/dateUtils';

Chart.register(...registerables, Filler);

interface MoodChartProps {
  moodEntries: MoodEntries;
  month?: number; // 0-indexed (0 = January, 11 = December)
  year?: number;
  expanded?: boolean; // Add expanded prop for full-size chart in chart view
}

const MoodChart: React.FC<MoodChartProps> = ({ 
  moodEntries, 
  month = new Date().getMonth(), 
  year = new Date().getFullYear(),
  expanded = false // Default to false for normal size
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Get days in the month (1-31)
    const daysInMonth = getDaysInMonth(year, month);
    
    // Generate data for each day of the month
    const labels: string[] = [];
    const dataPoints: (number | null)[] = [];
    const pointBackgroundColors: string[] = [];
    const pointRadii: number[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      // Format date as YYYY-MM-DD
      const date = new Date(year, month, day);
      const dateString = formatDateToString(date);
      
      // Just use day number (1-31) for x-axis labels
      labels.push(day.toString());

      // Check if there's a mood entry for this date
      const entry = moodEntries[dateString];
      if (entry && entry.mood) {
        const score = getMoodScore(entry.mood);
        dataPoints.push(score);
        const moodData = getMoodDataByScore(score);
        pointBackgroundColors.push(moodData?.color || 'rgba(0,0,0,0.1)');
        pointRadii.push(5);
      } else {
        dataPoints.push(null);
        pointBackgroundColors.push('rgba(0,0,0,0.1)');
        pointRadii.push(2);
      }
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (ctx) {
      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Mood',
            data: dataPoints,
            fill: true,
            backgroundColor: (context: ScriptableContext<"line">) => {
              const chart = context.chart;
              const {ctx, chartArea} = chart;
              if (!chartArea) {
                return 'rgba(0,0,0,0)';
              }
              const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
              gradient.addColorStop(0, 'rgba(75, 192, 192, 0.1)'); 
              gradient.addColorStop(1, 'rgba(75, 192, 192, 0.5)');
              return gradient;
            },
            borderColor: 'rgba(75, 192, 192, 1)', 
            tension: 0.3,
            spanGaps: true,
            pointRadius: pointRadii,
            pointHoverRadius: 7,
            pointBackgroundColor: pointBackgroundColors,
            segment: {
              borderColor: (context: ScriptableLineSegmentContext) => {
                const p0 = context.p0DataIndex;
                const p1 = context.p1DataIndex;
                const scoreP0 = dataPoints[p0];
                const scoreP1 = dataPoints[p1];
                if (scoreP0 !== null && scoreP1 !== null) {
                  const moodDataP0 = getMoodDataByScore(scoreP0);
                  return moodDataP0?.color || 'rgba(75, 192, 192, 1)';
                }
                return 'rgba(200, 200, 200, 1)';
              },
            }
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: false,
              min: 0.5,
              max: 5.5,
              position: 'left',
              ticks: {
                stepSize: 1,
                callback: function(_value) {
                  return '';
                },
                display: false
              },
              grid: {
                display: true,
                color: 'rgba(200, 200, 200, 0.2)'
              }
            },
            x: {
              grid: {
                display: true
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 31 // Show more day numbers on x-axis
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: function(context) {
                  let label = '';
                  if (context.parsed.y !== null) {
                    const moodData = getMoodDataByScore(context.parsed.y);
                    label += moodData ? `${moodData.emoji} ${moodData.label}` : context.parsed.y;
                  }
                  return label;
                },
                title: function(tooltipItems) {
                  const dataIndex = tooltipItems[0].dataIndex;
                  // Day is dataIndex + 1 (since we start from day 1)
                  const date = new Date(year, month, dataIndex + 1);
                  return formatDateToString(date);
                }
              }
            }
          }
        }
      });
    }

    // Create custom y-axis labels with emojis and colored circles
    if (chartContainerRef.current) {
      // Remove any existing custom y-axis labels
      const existingLabels = chartContainerRef.current.querySelectorAll('.custom-y-axis-label');
      existingLabels.forEach(label => label.remove());

      // Create new custom y-axis labels
      const yAxisLabels = [
        { value: 5, mood: 'veryhappy' },
        { value: 4, mood: 'happy' },
        { value: 3, mood: 'neutral' },
        { value: 2, mood: 'sad' },
        { value: 1, mood: 'verysad' }
      ];

      yAxisLabels.forEach(label => {
        const moodData = getMoodDataByScore(label.value);
        if (moodData && chartInstanceRef.current) {
          const yPos = chartInstanceRef.current.scales['y'].getPixelForValue(label.value);
          
          // Create the label element
          const labelElement = document.createElement('div');
          labelElement.className = 'custom-y-axis-label';
          labelElement.style.position = 'absolute';
          labelElement.style.left = '10px';
          labelElement.style.top = `${yPos - 12}px`; // Center vertically
          labelElement.style.width = '24px';
          labelElement.style.height = '24px';
          labelElement.style.borderRadius = '50%';
          labelElement.style.backgroundColor = moodData.color;
          labelElement.style.display = 'flex';
          labelElement.style.alignItems = 'center';
          labelElement.style.justifyContent = 'center';
          labelElement.style.fontSize = '16px';
          labelElement.style.zIndex = '10';
          labelElement.textContent = moodData.emoji;
          
          chartContainerRef.current?.appendChild(labelElement);
        }
      });
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      // Clean up custom labels
      if (chartContainerRef.current) {
        const existingLabels = chartContainerRef.current.querySelectorAll('.custom-y-axis-label');
        existingLabels.forEach(label => label.remove());
      }
    };
  }, [moodEntries, month, year]);

  // Get month name for the title
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthName = monthNames[month];
  return (
    <div className={`p-4 bg-white shadow-md rounded-lg ${expanded ? '' : 'mt-6'} w-full`} style={{ height: expanded ? '500px' : '350px' }}>
      {!expanded && (
        <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
          {monthName} {year} Mood Chart
        </h3>
      )}
      <div ref={chartContainerRef} style={{ position: 'relative', height: '100%', width: '100%', paddingLeft: '40px' }}>
        <canvas ref={chartRef} style={{ height: '100%', width: '100%' }}></canvas>
      </div>
    </div>
  );
};

export default MoodChart;
