import logo from '../../assets/gbm-logo.svg';

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-14 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2">
            <img
              src={logo}
              alt="Logo da GBM"
              className="h-8 w-auto w-[106px] 2xl:w-[124px]"
            />
          </a>

          <nav>
            <a
              href="https://www.gbmtech.com.br/pt-br"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-colors"
            >
              Sobre
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
