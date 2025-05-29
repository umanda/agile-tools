import Image from 'next/image';


const HomePage: React.FC = () => {
    return (
        <main className='mx-auto mt-6 flex max-w-7xl flex-col justify-center gap-6 px-3 font-[family-name:var(--font-geist-sans)] sm:mt-3 sm:gap-12 sm:px-0'>
            <div className='justify-centersm:items-start row-start-2 flex flex-col items-center gap-8'>
                <div className='flex items-center gap-4'>
                    <Image
                        className='h-6 sm:h-8 dark:invert'
                        src='/next.svg'
                        alt='Next.js logo'
                        width={180}
                        height={38}
                        priority
                    />
                    <h6 className='text-3xl font-bold'>+</h6>
                    {/* prettier-ignore */}
                    <div className="mr-4 flex items-center space-x-2 lg:mr-6"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="size-10"><rect width="256" height="256" fill="none"></rect><line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></line><line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"></line></svg><span className="font-bold text-2xl">shadcn/ui</span></div>
                </div>
                <ol className='list-inside list-decimal text-center font-[family-name:var(--font-geist-mono)] text-sm sm:text-left'>
                    <li className='mb-2'>
                        Get started by editing{' '}
                        <code className='rounded bg-black/[.05] px-1 py-0.5 font-semibold dark:bg-white/[.06]'>
                            src/app/page.tsx
                        </code>
                        .
                    </li>
                    <li>Save and see your changes instantly.</li>
                </ol>
                
            </div>
        </main>
    );
};

export default HomePage;
