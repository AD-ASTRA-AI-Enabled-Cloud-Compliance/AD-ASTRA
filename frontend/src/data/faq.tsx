import * as React from 'react'

const faq = {
  title: 'Frequently asked questions',
  // description: '',
  items: [
    {
      q: 'Can I deploy my infrastructure with SkyLock?',
      a: (
        <>
          Yes. Select the resources needed, cloud provider and regulatory
          frameworks, once processed you can download the IaaC files or
          deploy with one click.
          <br />
          (A policy with the appropriate permissions must 
          be created in your environment)
        </>
      ),
    },
    {
      q: 'Can I use Saas UI Pro for client work?',
      a: "Yes, that's totally up to you, as long as it fits the license you purchase.",
    },
    {
      q: 'Can I use Saas UI Pro for Open Source projects?',
      a: 'No currently not. A large part of Saas UI is already released under MIT license. We try to give back to the community as much as possible.',
    },
    {
      q: 'Does Saas UI include Figma, Sketch or other design files?',
      a: 'No, Saas UI does not include any design assets. Maintaining design resources costs a lot of extra effort. We believe small teams can move much faster by designing directly in code, with help of Storybooks.',
    },
  ],
}

export default faq
