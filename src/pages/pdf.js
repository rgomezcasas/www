import { borders, breakpoints, layout, colors } from 'theme'
import React, { useMemo, useState } from 'react'
import isUrl from 'is-url-http/lightweight'
import { getApiUrl } from '@microlink/mql'
import humanizeUrl from 'humanize-url'
import prependHttp from 'prepend-http'
import pickBy from 'lodash/pickBy'
import { getDomain } from 'tldts'
import get from 'dlv'

import { Minimize as MinimizeIcon, Book as BookIcon } from 'react-feather'

import {
  Choose,
  Box,
  Button,
  Caps,
  Card,
  CodeEditor,
  Container,
  Flex,
  Heading,
  Hide,
  Iframe,
  Image,
  Input,
  InputIcon,
  Link,
  Subhead,
  Text
} from 'components/elements'

import {
  ArrowLink,
  Average,
  Block,
  Caption,
  Faq,
  Features,
  FetchProvider,
  Layout
} from 'components/patterns'

import {
  useFeaturesPdf,
  useHealthcheck,
  useQueryState,
  useWindowSize
} from 'components/hook'

const SMALL_BREAKPOINT = Number(breakpoints[0].replace('px', ''))

const getMs = str => str.replace(/ms|s/, '')

const PDFPlaceholder = props => {
  return (
    <Flex
      border={3}
      borderColor='black20'
      alignItems='center'
      flexDirection='column'
      justifyContent='center'
      {...props}
    >
      <Image
        width={[3, 3, '60%', '60%']}
        style={{ opacity: 0.3, filter: 'grayscale(100%)' }}
        alt='Paste your URL'
        src='https://cdn.microlink.io/illustrations/abstract-no-messages.svg'
      />
      <Text pt={[2, 2, 4, 4]} fontSize={[2, 2, 4, 4]} color='black40'>
        Paste your URL
      </Text>
    </Flex>
  )
}

const LiveDemo = ({ data, query, suggestions, onSubmit, isLoading }) => {
  const size = useWindowSize()
  const dataPdfUrl = get(data, 'pdf.url')

  const cardBase = size.width < SMALL_BREAKPOINT ? 1.2 : 2
  const cardWidth = size.width / cardBase
  const cardHeight = cardWidth / Card.ratio

  const [inputFormat, setinputFormat] = useState(get(query, 'format'))
  const [inputUrl, setInputUrl] = useState(query.url || '')
  const [inputMargin, setinputMargin] = useState(get(query, 'margin'))

  const domain = useMemo(() => getDomain(inputUrl), [inputUrl])

  const values = useMemo(() => {
    const preprendUrl = prependHttp(inputUrl)

    return pickBy({
      url: isUrl(preprendUrl) ? preprendUrl : undefined,
      margin: inputMargin,
      format: inputFormat
    })
  }, [inputUrl, inputMargin, inputFormat])

  const suggestionUrl = useMemo(() => {
    const { url } = values
    const item = SUGGESTIONS.find(item => item.url === url)
    return item ? item.cdnUrl : undefined
  }, [values])

  const embedUrl = useMemo(() => {
    const { url, ...opts } = values
    if (!url) return
    const [embedUrl] = getApiUrl(url, {
      ...opts,
      pdf: true,
      meta: false,
      embed: 'pdf.url'
    })
    return embedUrl
  }, [values])

  const handleSubmit = event => {
    event.preventDefault()
    const { url, ...opts } = values
    return onSubmit(url, opts)
  }

  return (
    <Container as='section' alignItems='center' pt={[2, 2, 3, 3]}>
      <Heading px={5} titleize={false} maxWidth={layout.large}>
        PDF made simple
      </Heading>
      <Caption
        pt={[3, 3, 4, 4]}
        px={[4, 4, 0, 0]}
        titleize={false}
        maxWidth={[layout.small, layout.small, layout.small, layout.small]}
      >
        Simplify your workflow, use less to get – Turn websites into PDF, in an
        easy way.
      </Caption>
      <Flex
        alignItems={['center', undefined, undefined, undefined]}
        flexDirection={['column', 'row', 'row', 'row']}
        pt={[3, 3, 4, 4]}
      >
        <ArrowLink pr={[0, 4, 4, 4]} href='/docs/api/parameters/pdf'>
          Get Started
        </ArrowLink>
        <ArrowLink
          pt={[3, 0, 0, 0]}
          href='https://github.com/microlinkhq/browserless'
        >
          See on GitHub
        </ArrowLink>
      </Flex>
      <Flex justifyContent='center' alignItems='center'>
        <Flex
          as='form'
          pt={[3, 3, 4, 4]}
          pb={4}
          mx={[0, 0, 'auto', 'auto']}
          justifyContent='center'
          flexDirection={['column', 'column', 'row', 'row']}
          onSubmit={handleSubmit}
        >
          <Box mb={[3, 3, 0, 0]}>
            <Input
              fontSize={2}
              iconComponent={<InputIcon query={domain} />}
              id='pdf-demo-url'
              placeholder='Visit URL'
              suggestions={suggestions.map(
                ({ cdnUrl, filename, ...suggestion }) => suggestion
              )}
              type='text'
              value={inputUrl}
              onChange={event => setInputUrl(event.target.value)}
              width={['100%', '100%', '102px', '102px']}
              autoFocus
            />
          </Box>

          <Box ml={[0, 0, 2, 2]} mb={[3, 3, 0, 0]}>
            <Input
              placeholder='Margin'
              id='pdf-demo-margin'
              type='text'
              fontSize={2}
              width={['100%', '100%', '82px', '82px']}
              value={inputMargin}
              onChange={event => setinputMargin(event.target.value)}
              iconComponent={
                <MinimizeIcon color={colors.black50} width='16px' />
              }
              suggestions={[
                { value: '0' },
                { value: '0.35cm' },
                { value: '4mm' }
              ]}
            />
          </Box>

          <Box ml={[0, 0, 2, 2]} mb={[3, 3, 0, 0]}>
            <Input
              placeholder='Format'
              id='pdf-demo-format'
              type='text'
              fontSize={2}
              width={['100%', '100%', '84px', '84px']}
              value={inputFormat}
              onChange={event => setinputFormat(event.target.value)}
              iconComponent={<BookIcon color={colors.black50} width='16px' />}
              suggestions={[
                { value: 'Letter' },
                { value: 'Legal' },
                { value: 'Tabloid' },
                { value: 'A0' },
                { value: 'A1' },
                { value: 'A2' },
                { value: 'A3' },
                { value: 'A4' },
                { value: 'A5' },
                { value: 'A6' }
              ]}
            />
          </Box>

          <Button ml={[0, 0, 2, 2]} loading={isLoading}>
            <Caps fontSize={1}>Get it</Caps>
          </Button>
        </Flex>
      </Flex>

      <Flex pb={[4, 4, 5, 5]}>
        <Choose>
          <Choose.When condition={!!suggestionUrl || !!dataPdfUrl}>
            <Flex flexDirection='column' alignItems='center'>
              <Iframe width={cardWidth} src={suggestionUrl || dataPdfUrl} />
              <Box pt={4}>
                <CodeEditor width={cardWidth} language='html'>
                  {`<iframe src="${embedUrl}"></iframe>`}
                </CodeEditor>
              </Box>
            </Flex>
          </Choose.When>
          <Choose.Otherwise>
            <PDFPlaceholder height={cardHeight} width={cardWidth} />
          </Choose.Otherwise>
        </Choose>
      </Flex>
    </Container>
  )
}

const SUGGESTIONS = [
  { id: 'basecamp', url: 'https://basecamp.com/shapeup/0.3-chapter-01' },
  {
    id: 'alexmaccaw',
    url: 'https://blog.alexmaccaw.com/advice-to-my-younger-self'
  },
  {
    id: 'css-tricks',
    url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox'
  },
  {
    id: 'rauchg',
    url: 'https://rauchg.com/2014/7-principles-of-rich-web-applications'
  },
  {
    id: 'varnish-cache',
    url: 'https://varnish-cache.org/docs/6.2/phk/thatslow.html'
  }
].map(({ id, url }) => {
  const cdnUrl = `https://cdn.microlink.io/pdf/${id}.pdf`
  return { cdnUrl, url, id, value: humanizeUrl(url) }
})

const Timings = props => {
  const healthcheck = useHealthcheck()

  const blockOne = (
    <Flex flexDirection='column' justifyContent='center' alignItems='center'>
      <Subhead fontSize={[3, 4, 6, 6]} color='white' titleize={false}>
        Speed as feature
      </Subhead>
      <Subhead
        fontSize={[3, 4, 6, 6]}
        px={[4, 0, 0, 0]}
        titleize={false}
        color='white60'
      >
        Performance matters
      </Subhead>
    </Flex>
  )

  const blockTwo = (
    <Flex
      pt={[4, 4, 5, 5]}
      justifyContent={['space-around', 'space-around', 'center', 'center']}
      alignItems='baseline'
      px={[4, 4, 4, 0]}
      width='100%'
      maxWidth={layout.normal}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      <Flex
        display='inline-flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <Subhead
          as='div'
          fontSize={[3, 4, 4, 4]}
          color='white'
          fontWeight='bold'
        >
          {getMs(healthcheck.pdf.p95_pretty)}
          <Caption
            as='div'
            ml={2}
            color='white'
            display='inline'
            fontWeight='bold'
            titleize={false}
          >
            secs
          </Caption>
        </Subhead>
        <Caption as='div' color='white60' fontWeight='bold' pt={2}>
          <Caps fontSize={[0, 2, 2, 2]}>P95</Caps>
          <Caps fontSize={[0, 2, 2, 2]}>response time</Caps>
        </Caption>
      </Flex>
      <Hide breakpoints={[0, 1]}>
        <Flex
          display='inline-flex'
          px={[2, 2, 2, 5]}
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Subhead as='div' color='white' fontWeight='bold'>
            <Average value={healthcheck.pdf.avg_pretty} />
          </Subhead>
          <Caption as='div' color='white60' fontWeight='bold' titleize={false}>
            <Caps fontSize={[0, 2, 2, 2]}>average</Caps>
            <Caps fontSize={[0, 2, 2, 2]}>response time</Caps>
          </Caption>
        </Flex>
      </Hide>
      <Flex
        display='inline-flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <Subhead
          as='div'
          fontSize={[3, 4, 4, 4]}
          color='white'
          fontWeight='bold'
        >
          99.9
          <Caption
            as='div'
            ml={2}
            color='white'
            fontWeight='bold'
            display='inline'
          >
            %
          </Caption>
        </Subhead>
        <Caption as='div' color='white60' mr={3} fontWeight='bold' pt={2}>
          <Caps fontSize={[0, 2, 2, 2]}>SLA</Caps>
          <Caps fontSize={[0, 2, 2, 2]}>Guaranteed</Caps>
        </Caption>
      </Flex>
    </Flex>
  )

  return (
    <Block
      as='section'
      id='timings'
      width='100%'
      flexDirection='column'
      blockOne={blockOne}
      blockTwo={blockTwo}
      {...props}
    />
  )
}

const Resume = props => (
  <Container
    as='section'
    id='resume'
    alignItems='center'
    maxWidth={[layout.normal, layout.normal, layout.large, layout.large]}
    {...props}
  >
    <Subhead px={[3, 3, 6, 6]} variant='gradient'>
      Generate PDFs from any website
    </Subhead>
    <Caption
      py={3}
      maxWidth={[layout.small, layout.small, layout.normal, layout.normal]}
      titleize={false}
    >
      <b>Microlink for PDF</b> provides a set of powerful features without the
      headaches of running your own infrastructure, giving you great power, less
      responsibilities.
    </Caption>

    <Block
      blockOne={
        <Image
          width={[5, 6, 7, 8]}
          alt='PDF made simple'
          src='https://cdn.microlink.io/illustrations/genius-idea.svg'
        />
      }
      blockTwo={
        <Flex
          flexDirection='column'
          alignItems={['center', 'center', 'center', 'baseline']}
        >
          <Subhead pt={[5, 4, 4, 0]} fontSize={[3, 3, 4, 4]} textAlign='left'>
            Always up to date
          </Subhead>
          <Text
            pt={4}
            maxWidth={8}
            textAlign={['center', 'center', 'center', 'inherit']}
          >
            Every PDF has a <Link href='/docs/api/parameters/ttl'>ttl</Link>{' '}
            associated. After expiration, they will be automatically refreshed,
            reflecting any change present on the site.
          </Text>
        </Flex>
      }
    />

    <Block
      flexDirection='row-reverse'
      blockTwo={
        <Flex
          flexDirection='column'
          alignItems={['center', 'center', 'center', 'end']}
        >
          <Subhead pt={[5, 4, 4, 0]} textAlign='left' fontSize={[3, 3, 4, 4]}>
            Fully adaptable
          </Subhead>
          <Text
            pt={4}
            maxWidth={8}
            textAlign={['center', 'center', 'center', 'inherit']}
          >
            Such as set the paper{' '}
            <Link href='/docs/api/parameters/pdf/format'>format</Link>,
            establish a{' '}
            <Link href='/docs/api/parameters/pdf/margin'>margin</Link>, change
            the <Link href='/docs/api/parameters/pdf/scale'>scale</Link>, set{' '}
            <Link href='/docs/api/parameters/pdf/pageRanges'>page ranges</Link>,
            use <Link href='/docs/api/parameters/pdf/landscape'>landscape</Link>{' '}
            orientation, and a lot more.
          </Text>
        </Flex>
      }
      blockOne={
        <Image
          width={[5, 6, 7, 8]}
          alt='Browse automation'
          src='https://cdn.microlink.io/illustrations/abstract-2.svg'
        />
      }
    />

    <Block
      pb={Container.defaultProps.pt}
      blockOne={
        <Image
          width={[5, 6, 7, 8]}
          alt='Overlay composition'
          src='https://cdn.microlink.io/illustrations/abstract-page-is-under-construction.svg'
        />
      }
      blockTwo={
        <Flex
          flexDirection='column'
          alignItems={['center', 'center', 'center', 'baseline']}
        >
          <Subhead pt={[5, 4, 4, 0]} fontSize={[3, 3, 4, 4]} textAlign='left'>
            Embed directly
          </Subhead>
          <Text
            pt={4}
            maxWidth={8}
            textAlign={['center', 'center', 'center', 'inherit']}
          >
            Create PDFs on-demand and{' '}
            <Link href='/docs/api/parameters/embed'>embed</Link> them directly
            in your HTML markup, without being worried about code or
            infrastructure.
          </Text>
        </Flex>
      }
    />
  </Container>
)

const ProductInformation = props => {
  const healthcheck = useHealthcheck()

  return (
    <Faq
      as='section'
      id='information'
      title='Product Information'
      caption='All the details you need to know about the product.'
      pb={Container.defaultProps.pt}
      questions={[
        {
          question: 'What is it?',
          answer: (
            <>
              <div>
                <Text as='span' color='black' fontWeight='bold'>
                  Microlink for PDF
                </Text>{' '}
                is a simple way to generate a PDF from any website using{' '}
                <Link href='/docs/api/getting-started/overview'>
                  Microlink API
                </Link>
                .
              </div>
            </>
          )
        },
        {
          question: 'How does it work?',
          answer: (
            <>
              <div>
                The PDF will be generated after passing{' '}
                <Link href='/docs/api/parameters/pdf'>pdf</Link> query parameter
                to{' '}
                <Link href='/docs/api/getting-started/overview'>
                  Microlink API
                </Link>
                .
              </div>
              <div>
                For creating the file, a chromium browser will run on our own
                servers, getting a PDF file as output. Servers run the browser
                on top of optimized hardware to ensure the PDF is created as
                fast as possible but also under security isolation condition,
                spawning a new browser per every new request, meaning no
                browsers are shared between requests.
              </div>
              <div>
                After that, the PDF file is uploaded into{' '}
                <Link href='/blog/edge-cdn/'>Microlink CDN</Link> and served
                across +140 edges nodes to ensure the best worldwide access
                time.
              </div>
            </>
          )
        },
        {
          question: 'Why not run my own solution?',
          answer: (
            <>
              <div>
                The service aims to avoid headaches, preventing you for running
                and maintaining your own infrastructure.
              </div>
              ,
              <div>
                Every URL on the Internet are different and browser are a
                complex piece of software, with unpredictable resources usage.
              </div>
              ,
              <div>
                The fact of resolve any URL at scale in{' '}
                <Average size='tiny' value={healthcheck.pdf.avg_pretty} />{' '}
                isn&#039;t a trivial thing.
              </div>
            </>
          )
        },
        {
          question: 'Other questions?',
          answer: (
            <>
              <div>
                We&#039;re always available at{' '}
                <Link display='inline' href='mailto:hello@microlink.io'>
                  hello@microlink.io
                </Link>
                .
              </div>
            </>
          )
        }
      ]}
      {...props}
    />
  )
}

const PdfPage = () => {
  const [query] = useQueryState()
  const features = useFeaturesPdf()

  return (
    <Layout>
      <FetchProvider mqlOpts={{ meta: false, pdf: true }}>
        {({ status, doFetch, data }) => {
          const isLoading = status === 'fetching'
          return (
            <>
              <LiveDemo
                query={query}
                onSubmit={doFetch}
                isLoading={isLoading}
                suggestions={SUGGESTIONS}
                data={data}
              />
              <Timings
                pb={Container.defaultProps.pt}
                css={`
                  /* https://www.gradientmagic.com/collection/radialstripes */
                  background-image: radial-gradient(
                    circle at top right,
                    rgb(62, 41, 84) 0%,
                    rgb(62, 41, 84) 50%,
                    rgb(108, 28, 108) 50%,
                    rgb(108, 28, 108) 60%,
                    rgb(155, 14, 131) 60%,
                    rgb(155, 14, 131) 63%,
                    rgb(201, 1, 155) 63%,
                    rgb(201, 1, 155) 100%
                  );
                `}
                borderTop={`${borders[1]} ${colors.white20}`}
                borderBottom={`${borders[1]} ${colors.white20}`}
              />
              <Features
                title={
                  <>
                    <Subhead width='100%' textAlign='left'>
                      You call the API,
                    </Subhead>
                    <Subhead
                      color='#e000ac'
                      width='100%'
                      textAlign='left'
                      titleize={false}
                    >
                      we handle the rest.
                    </Subhead>
                  </>
                }
                caption={
                  <>
                    No code to maintain, no servers to deploy, but always ready
                    — Microlink allows you spend more time building, less time
                    configuring, easy integration via{' '}
                    <Link href='/docs/api/getting-started/overview'>API</Link>.
                  </>
                }
                features={features}
              />
              <Resume />
              <ProductInformation
                bg='pinky'
                borderTop={`${borders[1]} ${colors.pinkest}`}
                borderBottom={`${borders[1]} ${colors.pinkest}`}
              />
            </>
          )
        }}
      </FetchProvider>
    </Layout>
  )
}

export default PdfPage
