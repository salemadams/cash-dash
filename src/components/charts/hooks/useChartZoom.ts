import { useRef, useState, useEffect } from 'react';
import { useGlobalDate } from '@/contexts/GlobalDate';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook for managing chart zoom state and syncing with global date context
 */
export const useChartZoom = (data: any) => {
    const globalDate = useGlobalDate();
    const queryClient = useQueryClient();
    const chartRef = useRef<any>(null);
    const isZoomingRef = useRef(false);

    const [baseDateRange, setBaseDateRange] = useState({
        startDate: globalDate.startDate,
        endDate: globalDate.endDate,
    });

    const handleResetZoom = () => {
        if (!chartRef.current) return;

        isZoomingRef.current = true;
        chartRef.current.resetZoom();

        globalDate.setStartDate(baseDateRange.startDate);
        globalDate.setEndDate(baseDateRange.endDate);

        setTimeout(() => {
            isZoomingRef.current = false;
        }, 100);
    };

    const handleZoomComplete = ({ chart }: { chart: any }) => {
        if (isZoomingRef.current) return;

        const minIndex = Math.floor(chart.scales.x.min);
        const maxIndex = Math.ceil(chart.scales.x.max);
        const selectedRange = maxIndex - minIndex;

        if (selectedRange < 2) {
            isZoomingRef.current = true;
            chart.resetZoom();
            isZoomingRef.current = false;
            return;
        }

        const newStartDate = new Date(
            chart.scales.x.getLabelForValue(chart.scales.x.min)
        );
        const newEndDate = new Date(
            chart.scales.x.getLabelForValue(chart.scales.x.max)
        );

        const currentData = data;

        globalDate.setStartDate(newStartDate);
        globalDate.setEndDate(newEndDate);

        queryClient.setQueryData(
            [
                'transactions',
                newStartDate,
                newEndDate,
                globalDate.interval,
            ],
            currentData
        );
    };

    useEffect(() => {
        if (!chartRef.current || !data) return;

        const chart = chartRef.current;
        const isZoomed = chart.getZoomLevel && chart.getZoomLevel() > 1;

        if (!isZoomed) {
            setBaseDateRange({
                startDate: globalDate.startDate,
                endDate: globalDate.endDate,
            });
        }
    }, [data]);

    return {
        chartRef,
        handleResetZoom,
        handleZoomComplete,
    };
};
