import * as babel from '@babel/core'
import { TransformResult } from 'rollup'
import { createFilter } from '@rollup/pluginutils'

export function removeCliDecorators (): {
  name: string
  transform: (code: string, id: string) => TransformResult | null
} {
  const filter: (id: string) => boolean = createFilter(['**/*.ts', '**/*.js'])

  return {
    name: 'remove-cli-decorators',
    transform (code: string, id: string): TransformResult | null {
      if (!filter(id)) return null

      const result = babel.transformSync(code, {
        plugins: [
          [
            '@babel/plugin-proposal-decorators',
            { version: '2023-11' } // Use the modern decorators proposal
          ],
          function removeDecoratorsPlugin () {
            return {
              visitor: {
                ImportDeclaration (path: babel.NodePath<babel.types.ImportDeclaration>) {
                  // Remove the import statement for `Command`
                  if (path.node.source.value.includes('Command')) {
                    path.remove()
                  }

                  // Remove the import statement for `StoneCliAdapter` if unused
                  if (path.node.source.value.includes('StoneCliAdapter')) {
                    const binding = path.scope.getBinding(path.node.specifiers[0]?.local.name ?? '')
                    if (binding?.referencePaths?.length === 0) {
                      path.remove()
                    }
                  }
                },

                ClassDeclaration (path: babel.NodePath<babel.types.ClassDeclaration>) {
                  // Remove class if it has a decorator named `Command`
                  if (
                    path.node.decorators?.some(
                      (decorator: babel.types.Decorator) =>
                        babel.types.isCallExpression(decorator.expression) &&
                        babel.types.isIdentifier(decorator.expression.callee) &&
                        decorator.expression.callee.name === 'Command'
                    ) === true
                  ) {
                    path.remove()
                    return
                  }

                  // Remove only the `@StoneCliAdapter` decorator
                  if (path.node.decorators != null) {
                    path.node.decorators = path.node.decorators.filter(
                      (decorator: babel.types.Decorator) =>
                        !(
                          babel.types.isCallExpression(decorator.expression) &&
                          babel.types.isIdentifier(decorator.expression.callee) &&
                          decorator.expression.callee.name === 'StoneCliAdapter'
                        )
                    )
                  }
                }
              }
            }
          }
        ],
        parserOpts: {
          plugins: ['typescript', 'decorators']
        }
      })

      if (result?.code === undefined || result?.code === null) return null

      return {
        code: result.code,
        map: null
      }
    }
  }
}
