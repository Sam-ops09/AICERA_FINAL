import classNames from 'classnames';
import dayjs from 'dayjs';

import { Action, Link } from '@/components/atoms';
import ImageBlock from '@/components/molecules/ImageBlock';
import ArrowUpRightIcon from '@/components/svgs/arrow-up-right';
import { mapStylesToClassNames as mapStyles } from '@/utils/map-styles-to-class-names';
import Section from '../Section';

export default function ProjectFeedSection(props) {
    const {
        elementId,
        colors,
        variant = 'variant-a',
        title,
        subtitle,
        actions = [],
        styles = {},
        ...rest
    } = props;

    const sectionAlign = styles.self?.textAlign ?? 'left';

    return (
        <Section elementId={elementId} colors={colors} styles={styles.self}>
            <div className="container mx-auto px-4">
                {title && (
                    <h2 className={classNames('text-4xl sm:text-5xl font-bold mb-4', mapStyles({ textAlign: sectionAlign }))}>
                        {title}
                    </h2>
                )}

                {subtitle && (
                    <p className={classNames('text-lg sm:text-xl opacity-80', mapStyles({ textAlign: sectionAlign }), {
                        'mt-4': title
                    })}>
                        {subtitle}
                    </p>
                )}

                {variant === 'variant-d' ? (
                    <ProjectList
                        {...rest}
                        hasTopMargin={!!(title || subtitle)}
                        headingLevel={title ? 'h3' : 'h2'}
                    />
                ) : (
                    <ProjectGrid
                        {...rest}
                        variant={variant}
                        hasTopMargin={!!(title || subtitle)}
                        headingLevel={title ? 'h3' : 'h2'}
                    />
                )}

                {actions?.length > 0 && (
                    <div className={classNames(
                        'flex flex-wrap items-center gap-4 mt-12',
                        sectionAlign === 'center' ? 'justify-center' : 'justify-end'
                    )}>
                        {actions.map((action, index) => (
                            <Action key={index} {...action} />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}

function ProjectGrid(props) {
    const {
        variant,
        projects = [],
        showDate,
        showDescription,
        showFeaturedImage,
        showReadMoreLink,
        hasTopMargin,
        headingLevel
    } = props;

    if (projects.length === 0) {
        return null;
    }

    const TitleTag = headingLevel;

    return (
        <div className={classNames('grid gap-8', {
            'md:grid-cols-2': variant === 'variant-a',
            'md:grid-cols-3': variant === 'variant-b',
            'justify-center': variant === 'variant-c',
            'gap-x-8 lg:gap-x-12': variant !== 'variant-c',
            'mt-12': hasTopMargin
        })}>
            {projects.map((project, index) => (
                <Link
                    key={index}
                    href={project}
                    className="group relative block transition-all duration-300 hover:translate-y-1 rounded-lg overflow-hidden border-2 shadow-md hover:shadow-xl bg-white dark:bg-white/10"
                >
                    {showFeaturedImage && project.featuredImage && (
                        <div className="w-full overflow-hidden aspect-3/2">
                            <ImageBlock
                                {...project.featuredImage}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    )}

                    <div className="p-6">
                        {showDate && project.date && (
                            <div className="mb-2 text-sm opacity-70">
                                <ProjectDate date={project.date} />
                            </div>
                        )}

                        <TitleTag className="text-2xl sm:text-3xl font-semibold mb-3">{project.title}</TitleTag>

                        {showDescription && project.description && (
                            <p className="mt-3 text-base opacity-80">{project.description}</p>
                        )}

                        {showReadMoreLink && (
                            <div className="mt-6">
                                <span className="inline-flex text-xl transition rounded-full p-4 border-2 border-current group-hover:bottom-shadow-6 group-hover:-translate-y-1.5">
                                    <ArrowUpRightIcon className="fill-current w-icon h-icon" />
                                </span>
                            </div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}

function ProjectList(props) {
    const {
        projects = [],
        showDate,
        showDescription,
        showFeaturedImage,
        showReadMoreLink,
        hasTopMargin,
        headingLevel
    } = props;

    if (projects.length === 0) {
        return null;
    }

    const TitleTag = headingLevel;

    return (
        <div className={classNames('space-y-8', {
            'mt-12': hasTopMargin
        })}>
            {projects.map((project, index) => (
                <Link
                    key={index}
                    href={project}
                    className="group block transition-all duration-300 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        {showFeaturedImage && project.featuredImage && (
                            <div className="md:shrink-0 md:w-56 rounded-lg overflow-hidden">
                                <div className="w-full overflow-hidden aspect-3/2 md:h-full">
                                    <ImageBlock
                                        {...project.featuredImage}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="md:grow">
                            {showDate && project.date && (
                                <div className="mb-2 text-sm opacity-70">
                                    <ProjectDate date={project.date} />
                                </div>
                            )}

                            <TitleTag className="text-2xl sm:text-3xl font-semibold">{project.title}</TitleTag>

                            {showDescription && project.description && (
                                <p className="mt-3 text-base opacity-80">{project.description}</p>
                            )}
                        </div>

                        {showReadMoreLink && (
                            <div className="md:shrink-0">
                                <span className="inline-flex text-xl transition rounded-full p-4 border-2 border-current group-hover:bottom-shadow-6 group-hover:-translate-y-1.5">
                                    <ArrowUpRightIcon className="fill-current w-icon h-icon" />
                                </span>
                            </div>
                        )}
                    </div>
                </Link>
            ))}
        </div>
    );
}

function ProjectDate({ date }) {
    const dateTimeAttr = dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    const formattedDate = dayjs(date).format('MMM D, YYYY');
    return <time dateTime={dateTimeAttr}>{formattedDate}</time>;
}