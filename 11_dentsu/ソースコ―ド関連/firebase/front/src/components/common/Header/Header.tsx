import Link from 'next/link';
import PageTitle from '../PageTitle';
import useHeader from './useHeader';
import Head from 'next/head';

const Header = () => {
  const {
    getHeading,
    getBgColor,
    getIcon,
    getLink,
    getTitle,
    back,
    isEnableBackBtn,
  } = useHeader();

  const heading = getHeading();
  const bgColor = getBgColor();
  const icon = getIcon();
  const { url, label } = getLink();
  const title = getTitle();

  return (
    <>
      {title && (
        <Head>
          <title>{title}</title>
        </Head>
      )}
      <header>
        <div
          className={`flex items-center justify-between w-full h-16 py-5 px-5 ${bgColor}`}
        >
          {isEnableBackBtn() ? (
            <a
              onClick={back}
              className={
                'w-[62px] h-[34px] bg-white text-[15px] font-bold leading-[34px] text-center text-color-menu-button-text uppercase border border-color-menu-button rounded-lg'
              }
            >
              Back
            </a>
          ) : (
            <div className="w-[62px]"></div>
          )}
          <div className="flex items-center">
            {icon && <img src={icon} alt="アイコン" className={'pr-2'} />}
            <h1 className={'text-white text-lg font-bold'}>{heading}</h1>
          </div>
          <div className={'w-fit h-fit flex justify-between gap-2'}>
            {url ? (
              <Link href={url}>
                <a
                  className={
                    'w-[62px] h-[34px] bg-white text-[15px] font-bold leading-[34px] text-center text-color-menu-button-text uppercase border border-color-menu-button rounded-lg'
                  }
                >
                  {label}
                </a>
              </Link>
            ) : (
              <div className="w-[62px]"></div>
            )}
          </div>
        </div>
        <PageTitle />
      </header>
    </>
  );
};

export default Header;
