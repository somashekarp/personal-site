'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// Visitors who ask their device for reduced motion get fades instead of movement.
export default function Providers({ children }: { children: ReactNode }) {
	return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
