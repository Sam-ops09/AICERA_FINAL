import classNames from 'classnames';
import Markdown from 'markdown-to-jsx';

import { DynamicComponent } from '@/components/components-registry';
import FormBlock from '@/components/molecules/FormBlock';
import { mapStylesToClassNames as mapStyles } from '@/utils/map-styles-to-class-names';
import Section from '../Section';
import { useAuth } from '@/contexts/AuthContext';
import LoginSignupButton from '@/components/LoginSignupButton';

export default function ContactSection(props) {
    const { elementId, colors, backgroundSize, title, text, form, media, styles = {} } = props;
    const sectionAlign = styles.self?.textAlign ?? 'left';
    const { isLoggedIn } = useAuth();

    return (
        <Section elementId={elementId} colors={colors} backgroundSize={backgroundSize} styles={styles.self}>
            <div className={classNames('flex gap-8', mapFlexDirectionStyles(styles.self?.flexDirection ?? 'row'))}>
                <div className="flex-1 w-full border-2 p-4 rounded-xl shadow-2xl p-8">
                    {title && (
                        <h2 className={classNames('text-4xl sm:text-5xl', mapStyles({ textAlign: sectionAlign }))}>
                            {title}
                        </h2>
                    )}
                    {text && (
                        <Markdown
                            options={{ forceBlock: true, forceWrapper: true }}
                            className={classNames(
                                'max-w-none prose sm:prose-lg',
                                mapStyles({ textAlign: sectionAlign }),
                                {
                                    'mt-4': title
                                }
                            )}
                        >
                            {text}
                        </Markdown>
                    )}
                    {isLoggedIn ? (
                        form && <FormBlock {...form} className={classNames({ 'mt-12': title || text })} />
                    ) : (
                        <div className="mt-12 text-center">
                            <p className="mb-4">Please log in to access the contact form</p>
                            <LoginSignupButton variant="mobile" />
                        </div>
                    )}
                </div>
                {media && (
                    <div
                        className={classNames('flex flex-1 w-full', {
                            'justify-center': sectionAlign === 'center',
                            'justify-end': sectionAlign === 'right'
                        })}
                    >
                        <ContactMedia media={media} />
                    </div>
                )}
            </div>
        </Section>
    );
}

function ContactMedia({ media }) {
    return <DynamicComponent {...media} />;
}

function mapFlexDirectionStyles(flexDirection?: 'row' | 'row-reverse' | 'col' | 'col-reverse') {
    switch (flexDirection) {
        case 'row-reverse':
            return 'flex-col-reverse lg:flex-row-reverse lg:items-center';
        case 'col':
            return 'flex-col';
        case 'col-reverse':
            return 'flex-col-reverse';
        default:
            return 'flex-col lg:flex-row lg:items-center';
    }
}
