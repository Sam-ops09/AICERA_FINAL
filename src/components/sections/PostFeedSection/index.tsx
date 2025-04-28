import classNames from 'classnames';
import dayjs from 'dayjs';

import { Action, Link } from '@/components/atoms';
import ImageBlock from '@/components/molecules/ImageBlock';
import ArrowUpRightIcon from '@/components/svgs/arrow-up-right';
import { mapStylesToClassNames as mapStyles } from '@/utils/map-styles-to-class-names';
import Section from '../Section';

export default function PostFeedSection(props) {
    const { elementId, colors, variant = 'variant-a', title, subtitle, actions = [], styles = {}, ...rest } = props;
    const sectionAlign = styles.self?.textAlign ?? 'left';
    return (
        <Section elementId={elementId} colors={colors} styles={styles.self}>
            <div className="container mx-auto">
                {title && (
                    <h2 className={classNames('text-4xl sm:text-5xl font-bold mb-4', mapStyles({ textAlign: sectionAlign }))}>{title}</h2>
                )}
                {subtitle && (
                    <p
                        className={classNames('text-lg sm:text-xl opacity-80', mapStyles({ textAlign: sectionAlign }), {
                            'mt-4': title
                        })}
                    >
                        {subtitle}
                    </p>
                )}
                {variant === 'variant-d' ? (
                    <PostList {...rest} hasTopMargin={!!(title || subtitle)} headingLevel={title ? 'h3' : 'h2'} />
                ) : (
                    <PostGrid
                        {...rest}
                        variant={variant}
                        hasTopMargin={!!(title || subtitle)}
                        headingLevel={title ? 'h3' : 'h2'}
                    />
                )}
                {actions?.length > 0 && (
                    <div
                        className={classNames(
                            'flex flex-wrap items-center gap-4 mt-12',
                            sectionAlign === 'center' ? 'justify-center' : 'justify-end'
                        )}
                    >
                        {actions.map((action, index) => (
                            <Action key={index} {...action} />
                        ))}
                    </div>
                )}
            </div>
        </Section>
    );
}

function PostGrid(props) {
    const {
        variant,
        posts = [],
        showDate,
        showAuthor,
        showExcerpt,
        showFeaturedImage,
        showReadMoreLink,
        hasTopMargin,
        headingLevel
    } = props;
    if (posts.length === 0) {
        return null;
    }
    const TitleTag = headingLevel;
    return (
        <div
            className={classNames('grid gap-8', {
                'md:grid-cols-2': variant === 'variant-a',
                'md:grid-cols-3': variant === 'variant-b',
                'justify-center': variant === 'variant-c',
                'gap-x-8 lg:gap-x-10': variant !== 'variant-c',
                'mt-12': hasTopMargin
            })}
        >
            {posts.map((post, index) => (
                <Link key={index} href={post} className="group flex flex-col rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                    {showFeaturedImage && post.featuredImage && (
                        <div className="w-full overflow-hidden">
                            <ImageBlock
                                {...post.featuredImage}
                                className="object-cover w-full h-full aspect-video transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                        <PostAttribution
                            showDate={showDate}
                            showAuthor={showAuthor}
                            date={post.date}
                            author={post.author}
                            className="mb-2 text-sm opacity-70"
                        />
                        <TitleTag className="text-2xl sm:text-3xl font-semibold">{post.title}</TitleTag>
                        {showExcerpt && post.excerpt && <p className="mt-3 text-base opacity-80">{post.excerpt}</p>}
                        {showReadMoreLink && (
                            <div className="mt-6 pt-2">
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

function PostList(props) {
    const {
        posts = [],
        showDate,
        showAuthor,
        showExcerpt,
        showFeaturedImage,
        showReadMoreLink,
        hasTopMargin,
        headingLevel
    } = props;
    if (posts.length === 0) {
        return null;
    }
    const TitleTag = headingLevel;
    return (
        <div
            className={classNames('grid gap-8', {
                'mt-12': hasTopMargin
            })}
        >
            {posts.map((post, index) => (
                <Link key={index} href={post} className="group flex flex-col md:flex-row rounded-lg overflow-hidden border-2 shadow-md hover:shadow-xl transition-all duration-300">
                    {showFeaturedImage && post.featuredImage && (
                        <div className="md:w-1/4 lg:w-1/3 overflow-hidden">
                            <div className="w-full h-full">
                                <ImageBlock
                                    {...post.featuredImage}
                                    className="object-cover w-full h-full aspect-video md:h-full transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    )}
                    <div className="p-6 flex-1">
                        <PostAttribution
                            showDate={showDate}
                            showAuthor={showAuthor}
                            date={post.date}
                            author={post.author}
                            className="mb-2 text-sm opacity-70"
                        />
                        <TitleTag className="text-2xl sm:text-3xl font-semibold">{post.title}</TitleTag>
                        {showExcerpt && post.excerpt && <p className="mt-3 text-base opacity-80">{post.excerpt}</p>}
                    </div>
                    {showReadMoreLink && (
                        <div className="md:self-center p-6">
                            <span className="inline-flex text-xl transition rounded-full p-4 border-2 border-current group-hover:bottom-shadow-6 group-hover:-translate-y-1.5">
                                <ArrowUpRightIcon className="fill-current w-icon h-icon" />
                            </span>
                        </div>
                    )}
                </Link>
            ))}
        </div>
    );
}

function PostAttribution({ showDate, showAuthor, date, author, className = '' }) {
    if (!showDate && !(showAuthor && author)) {
        return null;
    }
    return (
        <div className={className}>
            {showDate && (
                <time dateTime={dayjs(date).format('YYYY-MM-DD HH:mm:ss')}>{dayjs(date).format('MMM D, YYYY')}</time>
            )}
            {showAuthor && author && (
                <>
                    {showDate && ' • '}
                    <span className="font-medium">{author.firstName} {author.lastName}</span>
                </>
            )}
        </div>
    );
}