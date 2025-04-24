import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'danger' | 'info';
}

export default function Alert({ message, type }: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      {message}
    </div>
  );
}
