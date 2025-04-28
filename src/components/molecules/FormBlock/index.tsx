import classNames from 'classnames';
import * as React from 'react';

import { Annotated } from '@/components/Annotated';
import { DynamicComponent } from '@/components/components-registry';
import { mapStylesToClassNames as mapStyles } from '@/utils/map-styles-to-class-names';

export default function FormBlock(props) {
    const { className, elementId, fields = [], submitLabel, styles = {} } = props;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (response.ok) {
                alert('Message sent successfully!');
                e.target.reset();
            } else {
                console.error('Server response:', responseData);
                alert(`Failed to send message: ${responseData.error || responseData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Network error while sending message. Please try again.');
        }
    };

    return (
        <form
            className={classNames('w-full', className)}
            data-sb-object-id={elementId}
            autoComplete="on"
            onSubmit={handleSubmit}
        >
            <div className="grid gap-6 sm:grid-cols-2">
                <input type="hidden" name="form-name" value={elementId} />
                {fields.map((field, index) => {
                    return <DynamicComponent key={index} {...field} />;
                })}
            </div>
            <div className={classNames('mt-8', mapStyles({ textAlign: styles.self?.textAlign ?? 'left' }))}>
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-xl px-5 py-4 text-lg transition border-2 border-current hover:bottom-shadow-6 hover:-translate-y-1.5"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}