import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'A Letter from the Creator | Algopatterns',
  description:
    'Learn about Algopatterns, a browser-based Strudel playground for live code music. Built with responsible AI principles and respect for creator rights.',
  openGraph: {
    title: 'A Letter from the Creator | Algopatterns',
    description:
      'Learn about Algopatterns, a browser-based Strudel playground built with responsible AI principles.',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4 md:px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-2">
        <span className="md:hidden">Creator&apos;s Letter</span>
        <span className="hidden md:inline">A Letter from the Creator</span>
      </h1>
      <p className="text-lg mb-12 flex flex-col md:flex-row md:gap-1">
        <span className="text-orange-400">Live Code Music.</span>
        <span className="text-emerald-400">Respect Creators.</span>
        <span className="text-blue-400">Use AI &quot;Responsibly&quot;.</span>
      </p>

      <section className="mb-12">
        <p className="text-muted-foreground font-light mb-4">
          Algopatterns is a browser-based Strudel playground for live coding music, built on{' '}
          <a
            href="https://strudel.cc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline">
            Strudel
          </a>
          , the powerful pattern language for music. But more than that, Algopatterns is an
          experiment in answering one of the most pressing questions in creative
          technology today:
        </p>
        <p className="text-lg font-semibold my-6">
          Can AI assist creative work without exploiting creators?
        </p>
        <p className="text-muted-foreground font-light">
          I believe the answer is yes. But only with intentional design, technical
          safeguards, and respect for creator autonomy baked into every layer of the
          system.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">The Origin Story</h2>
        <p className="text-muted-foreground font-light mb-4">
          Algopatterns began with a simple question. After watching{' '}
          <a
            href="https://vt.tiktok.com/ZS53jrCTw/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline">
            Switch Angel live code a music session on TikTok
          </a>
          , narrating every creative decision in real-time while building beats from
          scratch, I wondered:
        </p>
        <p className="text-muted-foreground font-light italic my-6 pl-4 border-l-2 border-violet-500">
          What if you could explore music production and pattern-making using natural
          language instructions? without memorizing syntax? What if the barrier to entry
          for creating music patterns with code could be lower, while still respecting the
          craft?
        </p>
        <p className="text-muted-foreground font-light mb-4">
          The goal is never to replace the skill and artistry involved in live coding
          music. It is to open a door. To let curious newcomers like me to experiment with
          Strudel patterns, help stuck musicians find their next idea and generally make
          the language more accessible without diminishing its depth.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">My Vision</h2>
        <p className="text-muted-foreground font-light mb-4">
          I see a future where creators can easily talk to agents using natural language
          instructions (text/voice commands) and get back{' '}
          <b className="text-white">authentic</b>, <b className="text-white">creative</b>{' '}
          material in real time - just like Switch Angel did on her TikTok video but in
          her case, she had to manually transcribe her thoughts and actions into text/code
          which in turn, instructs her computer on what patterns and sounds to play.
        </p>

        <p className="text-muted-foreground font-light mb-4">
          With voice activated ai agents, creating music with code or even creating art
          generally could possibly evolve to a point where all you&apos;ll need to do to
          bring your creative musical masterpiece? chord progression? drum loop that has
          been stuck in your head? or something else to life will be to simply: speak the
          line of thought out loud and your it will be transcribed, executed and played
          back to you in real time while maintaining the integrity of your creative
          process.
        </p>

        <p className="text-muted-foreground font-light mb-4">
          As nice and fururistic as all of this sounds, it may turn out to be that only
          creatives who actually know the craft will be able to administer surgically
          precise commands and instructions hence defeating the purpose of lowering the
          entry barrier via the use of ai agents or even worse, that writing the code out
          or controlling the DAW yourself is more effective than instructing an ai agent
          with a feedback speaker and a microphone to do it for you. I still believe this
          should be explored and experimented with nonetheless.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">The Problem I Had to Solve</h2>
        <p className="text-muted-foreground font-light mb-4">
          While building Algopatterns, I watched a{' '}
          <a
            href="https://x.com/todepond/status/2006713609154597256"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline">
            slightly similar ai-assisted music project
          </a>{' '}
          launch and immediately face backlash for utilizing public Strudel patterns,
          including CC-licensed work in its training data & prompts without permission or
          compatible licensing even though the project in question is open source. The
          response from the community was swift and clear:
        </p>
        <p className="font-semibold my-6 pl-4 py-3 bg-amber-500/10 border-l-4 border-amber-500 rounded-r">
          AI tools built on creative work, without consent, are not welcome.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          This isn&apos;t just about legal compliance. It is about trust, autonomy, and
          the fundamental question of who benefits when AI meets art.
        </p>
        <p className="text-muted-foreground font-light">
          I had a choice: abandon AI features entirely, or build something different.
          Something that treats creator rights as a core design constraint, not an
          afterthought.
        </p>
        <p className="text-muted-foreground font-light mt-4">I opted for the latter.</p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          My Philosophy: Consent as Architecture
        </h2>
        <p className="text-muted-foreground font-light mb-4">
          Most AI systems treat creator preferences as an obstacle to work around. I see
          them as the foundation to build upon.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          <strong>The core principle:</strong> AI assistance should only operate on
          content where the creator has explicitly permitted it. No inference, no
          assumptions, no &quot;opt-out by default.&quot;
        </p>
        <p className="text-muted-foreground font-light">
          This isn&apos;t just policy. It&apos;s architecture. Every technical decision in
          Algopatterns is designed to make respecting creator wishes the path of least
          resistance.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          How Algopatterns Enforces &quot;Responsible&quot; AI Use
        </h2>

        <div className="space-y-8 mt-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-blue-600">1.</span> Explicit Consent Framework
            </h3>
            <p className="text-muted-foreground font-light mb-4">
              Creators choose their AI preferences when saving work via CC Signals:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left p-3 font-semibold">Signal</th>
                    <th className="text-left p-3 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground font-light">
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-blue-600">CC-CR</td>
                    <td className="p-3">Allow AI use with attribution</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-emerald-600">CC-DC</td>
                    <td className="p-3">Attribution + support the creator</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-purple-600">CC-EC</td>
                    <td className="p-3">Attribution + contribute to the commons</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3 font-medium text-amber-600">CC-OP</td>
                    <td className="p-3">Attribution + keep derivatives open</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-rose-600">No-AI</td>
                    <td className="p-3">Explicitly opt out of all AI assistance</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground font-light mt-3">
              CC signals aren&apos;t a widely adopted standard yet, but on Algopatterns they
              shape how AI assistance behaves in your browser — when you save, share, or fork
              a pattern.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-emerald-600">2.</span> Inherited Restrictions on Forks
            </h3>
            <p className="text-muted-foreground font-light mb-3">
              When you fork a strudel with a{' '}
              <code className="text-sm bg-muted px-1.5 py-0.5 rounded">no-ai</code>{' '}
              signal, that restriction travels with it. AI is automatically disabled for:
            </p>
            <ul className="list-disc list-inside text-muted-foreground font-light space-y-1 ml-2">
              <li>
                Direct forks of{' '}
                <code className="text-sm bg-muted px-1.5 py-0.5 rounded">no-ai</code>{' '}
                strudels
              </li>
              <li>Subforks (forks of forks) down the entire lineage</li>
            </ul>
            <p className="text-muted-foreground font-light mt-3">
              You cannot fork someone&apos;s work and then use AI on it if they explicitly
              opted out. The original creator&apos;s wishes are respected through the
              entire derivative chain.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-purple-600">3.</span> In-Browser Enforcement
            </h3>
            <p className="text-muted-foreground font-light mb-3">
              Algopatterns runs entirely in your browser — no account, no server round-trips
              for your code. Safeguards are applied locally:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground font-light space-y-1 ml-2">
              <li>
                <strong>CC signals on save</strong> — your choice is stored with the
                strudel and embedded in shared links
              </li>
              <li>
                <strong>Fork restrictions</strong> — AI is blocked when you fork a pattern
                whose parent opted out
              </li>
              <li>
                <strong>Attribution headers</strong> — title, license, and author travel
                with saved and shared code as comment headers
              </li>
              <li>
                <strong>BYOK AI</strong> — when you use the Agent, requests go directly from
                your browser to your chosen provider with your own API key
              </li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-amber-600">4.</span> No Automatic Code Injection
            </h3>
            <p className="text-muted-foreground font-light mb-3">
              When the Agent suggests code, it <strong>never</strong> automatically
              updates your editor. You must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground font-light space-y-1 ml-2">
              <li>Manually copy the suggestion, or</li>
              <li>Explicitly click &quot;Update Editor&quot;</li>
            </ul>
            <p className="text-muted-foreground font-light mt-3">
              This keeps you in control and creates a clear record of what came from AI
              versus your own creativity.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">
              <span className="text-purple-600">5.</span> Complete Opt-Out
            </h3>
            <p className="text-muted-foreground font-light">
              Don&apos;t want AI at all? You can disable all AI features across the entire
              app. Algopatterns works perfectly fine as a pure live coding platform.
            </p>
          </div>
        </div>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">A Note on Imperfection</h2>
        <p className="text-muted-foreground font-light mb-4">
          I want to be honest: these safeguards are not foolproof. Someone determined
          enough could strip headers, bypass fork restrictions by rewriting code manually,
          or use external tools outside Algopatterns.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          I know this. I built the system anyway.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          Here&apos;s my thinking: perfect enforcement is impossible, but that is never
          the goal. The goal is to make respecting creator wishes the default, and to make
          circumvention require deliberate effort. If someone has to go out of their way
          to bypass these protections, they&apos;ve made a conscious choice to disregard a
          creator&apos;s explicit wishes. That&apos;s on them, not on the system.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          More importantly, the effort required to bypass these safeguards will almost
          always exceed the effort of just writing your own code or finding AI-permissive
          alternatives. The juice isn&apos;t worth the squeeze.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          These protections will continue to evolve. As I discover new bypass methods,
          I&apos;ll patch them. As the community identifies gaps, I&apos;ll address them.
          This is an ongoing commitment, not a finished product. The codebase is open
          precisely so others can help strengthen these safeguards over time.
        </p>
        <p className="text-muted-foreground font-light">
          Perfect is the enemy of good. I&apos;d rather ship something that raises the bar
          meaningfully than wait forever for an unbreakable solution that doesn&apos;t
          exist.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">What AI Actually Does in Algopatterns</h2>
        <p className="text-muted-foreground font-light mb-4">
          Let me be clear about what the Agent is and isn&apos;t:
        </p>
        <div className="overflow-x-auto my-6">
          <table className="w-full text-sm border border-border rounded-lg">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 font-semibold border-r border-border bg-emerald-500/10 text-emerald-700">
                  What it is
                </th>
                <th className="text-left p-3 font-semibold bg-rose-500/10 text-rose-700">
                  What it isn&apos;t
                </th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground font-light">
              <tr className="border-b border-border">
                <td className="p-3 border-r border-border">
                  A documentation assistant for Strudel syntax
                </td>
                <td className="p-3">A replacement for creative skill</td>
              </tr>
              <tr className="border-b border-border">
                <td className="p-3 border-r border-border">
                  A pattern suggester that offers ideas on request
                </td>
                <td className="p-3">
                  A generator that produces &quot;complete songs&quot;
                </td>
              </tr>
              <tr>
                <td className="p-3 border-r border-border">
                  A learning tool for exploring live coding
                </td>
                <td className="p-3">A shortcut to skip learning</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground font-light">
          The Agent helps you understand Strudel better and move faster when you&apos;re
          stuck. It doesn&apos;t create art for you. It helps you create your own.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Why This Matters Beyond Algopatterns</h2>
        <p className="text-muted-foreground font-light mb-4">
          The tension between AI and creative communities isn&apos;t going away. As AI
          capabilities grow, this conflict will only intensify. Unless we build systems
          that prove another path is possible.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          Algopatterns is my contribution to that proof. I&apos;m demonstrating that:
        </p>
        <ol className="list-decimal list-inside text-muted-foreground font-light space-y-2 ml-2">
          <li>
            <strong className="text-white">Technical enforcement</strong> of creator
            preferences is possible
          </li>
          <li>
            <strong className="text-white">Consent-first design</strong> can coexist with
            useful AI features
          </li>
          <li>
            <strong className="text-white">Transparency</strong> about data sources builds
            rather than erodes trust
          </li>
          <li>
            <strong className="text-white">Community values</strong> can be encoded into
            architecture, not just policy
          </li>
        </ol>
        <p className="text-muted-foreground font-light mt-4">
          I don&apos;t claim to have solved everything. But I&apos;m building in public,
          documenting my decisions, and inviting scrutiny.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Open Source and Accountability</h2>
        <p className="text-muted-foreground font-light mb-4">
          Algopatterns is fully open source under AGPL-3.0. Every technical safeguard
          described above is in the codebase for anyone to inspect, critique, or improve.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          AGPL-3.0 is the right call because Strudel itself is AGPL-licensed, and Algopatterns
          as a platform wouldn&apos;t be possible without the incredible work done by all
          the open-source contributors who built Strudel. If you build on Strudel and/or
          Algopatterns, you inherit both of their capabilities and their commitment to staying
          open.
        </p>
        <p className="text-muted-foreground font-light">
          I believe the best way to earn trust is to show my work as well as my workflow.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          To Creatives & the Strudel Community
        </h2>
        <p className="text-muted-foreground font-light mb-4">
          I know AI tools have extracted value from your work without permission before
          now and is still doing so. I understand the skepticism.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          I&apos;m not asking for a blind or instant benefit of doubt granted to algopatterns
          by the community. I&apos;m asking for the chance to demonstrate that AI
          assistance and creator rights can coexist. And I&apos;m inviting you to join me
          in this experiment.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          If you find a flaw in these safeguards, tell me. If you think I&apos;ve missed
          something, open an issue. If you want to make this system stronger, contribute.
        </p>
        <p className="text-muted-foreground font-light mb-4">
          Algopatterns is open source, and the community will shape where it goes from here.
        </p>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Features</h2>
        <p className="text-muted-foreground font-light mb-4">
          Beyond the experimental &quot;responsible&quot; framework, Algopatterns offers:
        </p>
        <ul className="list-disc list-inside text-muted-foreground font-light space-y-2 ml-2">
          <li>
            <strong className="text-white">Clean editor interface</strong> with kind ux
            and a distraction-free design
          </li>
          <li>
            <strong className="text-white">DAW-style sample browser</strong> with
            categorized sound groups in the sidebar
          </li>
          <li>
            <strong className="text-white">Strudel Player</strong> — browse and play
            patterns from the Strudel community site
          </li>
          <li>
            <strong className="text-white">Full Strudel support</strong> with the complete
            pattern language in your browser
          </li>
          <li>
            <strong className="text-white">Local shelf</strong> — save strudels in your
            browser with optional CC license and AI signals
          </li>
          <li>
            <strong className="text-white">Share and fork</strong> — copy a compressed link
            or fork from your shelf; attribution travels in code headers
          </li>
          <li>
            <strong className="text-white">Extensive sample library</strong> including
            drum machines, synths, and soundfonts
          </li>
          <li>
            <strong className="text-white">AI assistance</strong> (BYOK, when permitted) for
            exploring new patterns
          </li>
        </ul>
      </section>

      <hr className="my-8 border-border" />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <div className="space-y-4 md:space-y-2">
          <p className="text-muted-foreground font-light">
            <span className="block md:inline">Ready to try live coding?</span>{' '}
            <Link
              href="/"
              className="text-emerald-400 hover:text-emerald-300 hover:underline">
              Launch the editor →
            </Link>
          </p>
          <p className="text-muted-foreground font-light">
            <span className="block md:inline">New to strudel/algorithmic composition?</span>{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://strudel.cc/workshop/getting-started/"
              className="text-orange-500 hover:text-orange-400 hover:underline">
              Checkout the docs →
            </a>
          </p>
          <p className="text-muted-foreground font-light">
            <span className="block md:inline">Want to dive into the code or contribute?</span>{' '}
            <a
              href="https://github.com/algopatterns/frontend"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 hover:underline">
              View on GitHub →
            </a>
          </p>
        </div>
      </section>

      <hr className="my-8 border-border" />

      <footer className="text-center">
        <p className="text-muted-foreground font-light italic mb-4">
          Beats drop, creator rights shouldn&apos;t.
        </p>
      </footer>
    </div>
  );
}
