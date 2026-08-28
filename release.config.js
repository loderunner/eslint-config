export default {
  branches: ['main'],
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        parserOpts: {
          headerPattern: /^(\w*)(?:\((.*)\))?(!)?: (.*)$/,
          headerCorrespondence: ['type', 'scope', 'breaking', 'subject'],
          breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
        },
      },
    ],
    '@semantic-release/release-notes-generator',
    ['@semantic-release/npm', { npmPublish: false }],
    [
      '@semantic-release/exec',
      {
        prepareCmd: `node -e "
          const fs = require('fs');
          for (const path of [
            'packages/eslint-plugin-loderunner/package.json',
            'packages/eslint-config-loderunner/package.json',
            'packages/oxc-config-loderunner/package.json',
          ]) {
            const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));
            pkg.version = '\${nextRelease.version}';
            fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\\n');
          }
        "`,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'packages/eslint-plugin-loderunner/package.json',
          'packages/eslint-config-loderunner/package.json',
          'packages/oxc-config-loderunner/package.json',
        ],
        message: 'chore(release): ${nextRelease.version}',
      },
    ],
    '@semantic-release/github',
  ],
};
