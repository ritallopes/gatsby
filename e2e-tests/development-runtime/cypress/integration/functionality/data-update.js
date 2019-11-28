const FILE_CONTENT = `
---
title: A new post
date: ${new Date().toJSON()}
# foo: freshField
---

A brand new post

`.trim()

describe(`on new file`, () => {
  beforeEach(() => {
    cy.visit(`/`).waitForRouteChange()
  })

  it(`re-runs GraphQL queries with new file contents`, () => {
    const content = JSON.stringify(FILE_CONTENT)
    cy.exec(
      `npm run update -- --file content/sample.md --file-content \\"${content}\\"`
    )

    cy.get(`ul`)
      .find(`li:nth-child(2)`)
      .should(`exist`, 1)
  })
})

describe(`on schema change`, () => {
  beforeEach(() => {
    const content = JSON.stringify(FILE_CONTENT)
    cy.exec(
      `npm run update -- --file content/sample.md --file-content \\"${content}\\"`
    )
    cy.visit(`/`).waitForRouteChange()
  })

  it(`rebuilds GraphQL schema`, () => {
    cy.exec(
      `npm run update -- --file content/sample.md --exact --replacements "# foo:foo"`
    )
    cy.exec(
      `npm run update -- --file src/pages/schema-rebuild.js --exact --replacements "# foo:foo"`
    )

    cy.visit(`/schema-rebuild/`)
    cy.get(`p`).contains(`"foo":"freshField"`)
  })
})
