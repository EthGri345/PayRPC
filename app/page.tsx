'use client';

import { motion } from 'framer-motion';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { CodeBlock } from './components/CodeBlock';

export default function HomePage() {
  return (
    <div className="min-h-screen noise">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="text-xl font-semibold">PayRPC</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/api/v1/docs" className="text-sm text-text-muted hover:text-text transition-colors">
              Documentation
            </a>
            <a href="https://github.com" className="text-sm text-text-muted hover:text-text transition-colors">
              GitHub
            </a>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-sm text-text-muted">HTTP 402 Payment Protocol</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-balance">
              Blockchain Data Access
              <br />
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Built for Agents
              </span>
            </h1>

            <p className="text-xl text-text-muted mb-12 text-balance max-w-2xl mx-auto">
              Pay-per-request Solana API with zero registration.
              No API keys, no subscriptions, just cryptographic payments.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Button size="lg">Start Building</Button>
              <Button variant="secondary" size="lg">View Documentation</Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-8 mt-20 max-w-3xl mx-auto">
              {[
                { value: '<175ms', label: 'Response Time' },
                { value: '$0.01', label: 'Per Request' },
                { value: '15+', label: 'Endpoints' },
                { value: '0', label: 'Setup Required' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-bold text-text mb-1">{stat.value}</div>
                  <div className="text-sm text-text-subtle">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Simple Integration</h2>
              <p className="text-lg text-text-muted">Three steps. One second. Zero friction.</p>
            </div>

            <Card glow>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-text-subtle mb-2">Step 1: Make Request</div>
                  <CodeBlock
                    code={`curl https://api.payrpc.xyz/v1/account/balance/ADDRESS`}
                  />
                </div>
                <div>
                  <div className="text-sm text-text-subtle mb-2">Step 2: Receive Payment Details</div>
                  <CodeBlock
                    code={`{
  "payment": {
    "amount": 0.001,
    "recipient": "FzKy...",
    "requestId": "abc123"
  }
}`}
                  />
                </div>
                <div>
                  <div className="text-sm text-text-subtle mb-2">Step 3: Pay & Retry</div>
                  <CodeBlock
                    code={`curl -H "x-payment-signature: SIGNATURE" \\
     -H "x-request-id: abc123" \\
     https://api.payrpc.xyz/v1/account/balance/ADDRESS`}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why PayRPC</h2>
            <p className="text-lg text-text-muted">Built for the autonomous economy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Instant Access',
                description: 'No registration, no email verification, no approval process. Request, pay, receive.',
                icon: '⚡',
              },
              {
                title: 'Cryptographic Auth',
                description: 'Payment proof replaces API keys. Zero credentials to manage or rotate.',
                icon: '🔐',
              },
              {
                title: 'True Pay-Per-Use',
                description: '$0.01 per request whether you make 1 or 1 million calls. No tiers, no minimums.',
                icon: '💎',
              },
              {
                title: 'Agent Native',
                description: 'Machine-readable pricing. Autonomous discovery. Zero human intervention.',
                icon: '🤖',
              },
              {
                title: 'Unlimited Scale',
                description: 'No rate limits. No quotas. Pay for exactly what you consume.',
                icon: '📈',
              },
              {
                title: 'Verifiable',
                description: 'Every transaction recorded on Solana. Immutable audit trail.',
                icon: '✓',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-text-muted leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Transparent Pricing</h2>
            <p className="text-lg text-text-muted">Hold tokens, save more</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { tier: 'Standard', tokens: '0', discount: '0%', price: '$0.010' },
              { tier: 'Bronze', tokens: '100+', discount: '20%', price: '$0.008' },
              { tier: 'Silver', tokens: '1,000+', discount: '50%', price: '$0.005' },
              { tier: 'Gold', tokens: '10,000+', discount: '80%', price: '$0.002' },
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={i === 2 ? 'gradient-border' : ''}>
                  <div className="text-center">
                    <div className="text-sm text-text-subtle mb-2">{tier.tier}</div>
                    <div className="text-3xl font-bold mb-4">{tier.price}</div>
                    <div className="text-sm text-text-muted mb-4">per request</div>
                    <div className="space-y-2 text-sm">
                      <div className="text-text-subtle">Hold {tier.tokens} tokens</div>
                      <div className="text-accent font-medium">{tier.discount} off</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="text-center max-w-3xl mx-auto" glow>
            <h2 className="text-4xl font-bold mb-4">Ready to Build?</h2>
            <p className="text-xl text-text-muted mb-8">
              Start accessing Solana blockchain data in seconds
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="secondary" size="lg">Read Documentation</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-subtle">
              © 2025 PayRPC. Built for the agent economy.
            </div>
            <div className="flex items-center gap-6 text-sm text-text-subtle">
              <a href="/api/v1/docs" className="hover:text-text transition-colors">Docs</a>
              <a href="https://github.com" className="hover:text-text transition-colors">GitHub</a>
              <a href="https://twitter.com" className="hover:text-text transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
