
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // First check if table exists
        const { error: tableError } = await supabase
            .from('contact_messages')
            .select('count')
            .limit(1);

        // If table doesn't exist, create it
        if (tableError && tableError.message.includes('does not exist')) {
            const { error: createError } = await supabase.rpc('create_contact_messages_table');
            if (createError) {
                console.error('Error creating table:', createError);
                return res.status(500).json({
                    message: 'Error creating contact messages table',
                    error: createError.message
                });
            }
        }

        // Now try to insert the data
        const { data, error: insertError } = await supabase
            .from('contact_messages')
            .insert([{
                first_name: req.body.firstName,
                last_name: req.body.lastName,
                email: req.body.email,
                address: req.body.address,
                created_at: new Date().toISOString()
            }]);

        if (insertError) {
            console.error('Supabase insert error:', insertError);
            return res.status(500).json({
                message: 'Error saving message',
                error: insertError.message
            });
        }

        return res.status(200).json({
            message: 'Message sent successfully',
            data
        });
    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: 'Server error while saving message',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}
