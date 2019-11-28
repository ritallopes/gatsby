const FILE_CONTENT = `
---
title: A new post
date: ${new Date().toJSON()}
# foo: freshField
---

A brand new post

`.trim()

const updateSampleFileCommand = replacements => {
  const content = JSON.stringify(FILE_CONTENT)
  let command = `npm run update -- --file content/sample.md --file-content \\"${content}\\"`
  if (replacements) {
    command = `${command} --exact --replacements "${replacements}"`
  }
  cy.exec(command)
}

describe(`on new file`, () => {
  beforeEach(() => {
    cy.visit(`/`).waitForRouteChange()
  })

  it(`re-runs GraphQL queries with new file contents`, () => {
    updateSampleFileCommand()

    cy.get(`ul`)
      .find(`li:nth-child(2)`)
      .should(`exist`, 1)
  })
})

describe(`on schema change`, () => {
  beforeEach(() => {
    updateSampleFileCommand()
    cy.visit(`/`).waitForRouteChange()
  })

  it(`rebuilds GraphQL schema`, () => {
    updateSampleFileCommand(`# foo:foo`)

    cy.visit(`/schema-rebuild/`)
    cy.get(`p`).contains(`"foo":"freshField"`)
  })
})
