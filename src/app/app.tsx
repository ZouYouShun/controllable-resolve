/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react';

// @ts-ignore
import controllableResolveExampleCode from './code/controllable-resolve-example.html?raw';
// @ts-ignore
import useControllableResolveExampleCode from './code/use-controllable-resolve-example?raw';
// @ts-ignore
import useControllableResolveOnceExampleCode from './code/use-controllable-resolve-once-example?raw';
import { CodePreview } from './components/CodePreview';
import { GitHub } from './components/GitHub';
import { CreateControllableResolveExamples } from './controllable-resolve-example';
import { UseControllableResolveExample } from './use-controllable-resolve-example';
import { UseControllableResolveOnceExample } from './use-controllable-resolve-once-example';

const activeClassName = 'bg-yellow-300 text-black font-bold';

const viewMap = {
  controllableResolve: {
    title: 'controllableResolve',
    code: controllableResolveExampleCode,
    component: CreateControllableResolveExamples,
    language: 'html',
  },
  useControllableResolve: {
    title: 'useControllableResolve',
    code: useControllableResolveExampleCode,
    component: UseControllableResolveExample,
    language: 'tsx',
  },
  once: {
    title: 'once',
    code: useControllableResolveOnceExampleCode,
    component: UseControllableResolveOnceExample,
    language: 'tsx',
  },
};

type ViewMapKey = keyof typeof viewMap;

const tabs = Object.keys(viewMap) as unknown as ViewMapKey[];

const initActiveTab = document.location.hash.replace('#', '');

export function App() {
  const [activeTab, setActiveTab] = useState<ViewMapKey>(
    (initActiveTab as ViewMapKey) || 'controllableResolve'
  );

  const activeView = viewMap[activeTab];

  const code = activeView.code;
  const language = activeView.language;
  const Component = activeView.component;

  useEffect(() => {
    document.location.hash = activeTab;
  }, [activeTab]);

  return (
    <div className="h-full grid grid-cols-12 p-4 pt-6 md:p-12 gap-5">
      <nav className="col-span-full md:col-span-6 lg:col-span-5 md:grid md:grid-rows-2 md:h-full md:overflow-hidden gap-3">
        <div className="flex flex-col justify-end items-center">
          <h1 className="text-2xl sm md:text-3xl lg:text-4xl text-yellow-300 font-bold text-center">
            ControllableResolve
          </h1>
          <h6 className="text-xl text-gray-200 mt-5">
            A simple controllable promise resolve <br />
            let you can control{' '}
            <span className="underline font-bold italic">when</span> to resolve
            promise
          </h6>
          <div className="mt-10 md:mt-10 w-96 max-w-full">
            <h6 className="text-xl mb-2 text-gray-200">Vanilla js</h6>
            <CodePreview
              code="npm i controllable-resolve"
              language="bash"
              classes={{
                copyButton: 'mt-2 mr-1',
                root: 'h-auto',
              }}
            />

            <h6 className="text-xl my-2 text-gray-200">React Hook</h6>
            <CodePreview
              code="npm i use-controllable-resolve"
              language="bash"
              classes={{
                copyButton: 'mt-2 mr-1',
                root: 'h-auto',
              }}
            />
          </div>
        </div>

        <div className="p-5 overflow-auto">
          <Component />
        </div>
      </nav>
      <main className="h-screen md:h-auto col-span-full md:col-span-6 lg:col-span-7 overflow-hidden flex flex-col shadow-2xl">
        <ul className="bg-blue-500 rounded-t flex flex-wrap flex-none overflow-hidden">
          {tabs.map((key) => {
            const { title } = viewMap[key];
            return (
              <li
                key={key}
                className={activeTab === key ? activeClassName : undefined}
              >
                <button
                  className="px-4 py-2 focus:outline-none focus:bg-yellow-500/70 hover:bg-yellow-500/70"
                  onClick={() => {
                    setActiveTab(key);
                  }}
                >
                  {title}
                </button>
              </li>
            );
          })}
          <li className="flex-auto" />
          <li className="">
            <a
              title="Go to GitHub"
              className="flex justify-center items-center px-2 text-white h-full text-sm focus:outline-none focus:bg-yellow-500/70 hover:bg-yellow-500/70"
              href="https://github.com/ZouYouShun/controllable-resolve"
            >
              <GitHub />
            </a>
          </li>
        </ul>
        <CodePreview
          code={code}
          classes={{ root: 'flex-auto rounded-b' }}
          language={language as any}
        />
      </main>
    </div>
  );
}

export default App;
