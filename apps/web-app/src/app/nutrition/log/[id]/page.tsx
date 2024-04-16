import { Chilanka } from 'next/font/google';
import type React from 'react';
import { LogForm } from './form';

export default function LogEntryPage({
	children,
}: {
	children: React.ReactNode;
}) {
	return <LogForm />;
}
