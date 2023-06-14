import Link from 'next/link';

type HeaderParams = {
  menuType: number;
  menuTitle: string;
};

const Header = ({ menuType, menuTitle }: HeaderParams) => {
  let elmHeader = (
    <header className="bg-color-gray">
      <div className="pt-[13px] pr-[23px] pb-[13px] pl-[27px] flex justify-between items-center">
        <h1 className="font-sans text-header-title text-color-white font-bold">
          {menuTitle}
        </h1>
      </div>
    </header>
  );

  switch (menuType) {
    case 1:
    case 2:
      elmHeader = (
        <header
          className={menuType === 1 ? 'bg-color-green' : 'bg-color-blue sticky'}
        >
          <div className="pt-[17px] pr-[23px] pb-[18px] pl-[27px] flex justify-between items-center">
            <h1 className="font-sans text-header-title text-color-white font-bold">
              {menuTitle}
            </h1>
            <div className="w-[32px]">
              <Link href="/00_menu">
                <svg className="fill-none w-8 h-7" viewBox="0 0 32 28">
                  <path
                    d="M16 0L0 12H4V28H12V20H20V28H28V11.88L32 12L16 0V0Z"
                    fill="white"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </header>
      );
      break;

    case 0:
    default:
      break;
  }
  return elmHeader;
};

export default Header;
