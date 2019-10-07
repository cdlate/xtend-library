import React from 'react'
import PropTypes from 'prop-types'
import { StaticQuery, graphql } from 'gatsby'
import Helmet from 'react-helmet'

import Header from 'components/header'
import Footer from 'components/footer'
import Sidebar from 'components/sidebar'
import DocsAside from 'components/doc-aside'
import DocsFoot from 'components/doc-foot'

import { populateBlock } from 'assets/scripts/demo.js'
import { makeDocument } from 'assets/scripts/theme.js'
import 'xtend-library'
import 'xtend-library/src/xtend-core.js'
import 'xtend-library/src/xtend-demo.js'
import 'xtend-library/src/xtend-extension.js'

import 'assets/styles/theme.css'

class Layout extends React.Component {
  componentDidMount () {
    populateBlock()
    makeDocument()
  }

  render () {
    const { seo, page, children } = this.props
    return (
      <StaticQuery
        query={graphql`
          query {
            site {
              siteMetadata {
                title
                author
                version
                npm
                github
                download
              }
            }
          }
        `}
        render={data => (
          <>
            <Helmet>
              <script>
                {`
                var $buoop = {required: {e: 15, f: 48, o: 34, s: 10, c: 47}, reminder: 0, no_permanent_hide: true, api: 2019.05};
                `}</script>
              <script src="//browser-update.org/update.min.js" defer></script>
            </Helmet>
            <div className={`site_wrapper
              ${page ? ' site_wrapper--with-sidebar site_wrapper--with-aside' : ''}`}>

              <Header site={data} seo={seo} page={page}/>

              <main className="site_main">
                <div className="site_main_inner">

                  {page
                    ? <div className="site--with-sidebar site--with-aside">
                      <Sidebar page={page}/>
                      <article className="site_article">
                        <div className="site_article_hero">
                          <div className="container full">
                            <h1>{seo.title}</h1>
                            <p>{seo.description}</p>
                          </div>
                        </div>
                        <div className="site_article_content">
                          <div className="container full">
                            {children}
                          </div>
                        </div>
                        <div className="site_article_foot">
                          <div className="container full">
                            <DocsFoot page={page}/>
                          </div>
                        </div>
                      </article>
                      <DocsAside page={page}/>
                    </div>
                    : <article className="site_article">
                      <div className="site_article_content">
                        <div className="container full">
                          {children}
                        </div>
                      </div>
                    </article>
                  }

                </div>
              </main>

              <Footer site={data} seo={seo}/>

            </div>
          </>
        )}
      />
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
