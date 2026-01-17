declare module 'react-confetti' {
    import React from 'react';

    export interface ConfettiProps {
        width: number;
        height: number;
        numberOfPieces?: number;
        recycle?: boolean;
        colors?: string[];
        // Add other props as needed
    }

    export default class Confetti extends React.Component<ConfettiProps> { }
}

declare module 'react-use' {
    export function useWindowSize(initialWidth?: number, initialHeight?: number): { width: number; height: number };
    // Add other hooks as needed
}
