import ts from 'typescript';

export function createModuleAnnotation({
  imports = [],
  controllers = [],
  providers = []
}) {
  const moduleAnnotation = ts.factory.createDecorator(
    ts.factory.createCallExpression(
      ts.factory.createIdentifier('Module'),
      undefined,
      [
        ts.factory.createObjectLiteralExpression([
          ts.factory.createPropertyAssignment(
            'imports',
            ts.factory.createArrayLiteralExpression(imports)
          ),
          ts.factory.createPropertyAssignment(
            'controllers',
            ts.factory.createArrayLiteralExpression(controllers)
          ),
          ts.factory.createPropertyAssignment(
            'providers',
            ts.factory.createArrayLiteralExpression(providers)
          )
        ])
      ]
    )
  );

  return moduleAnnotation;
}

export const entityAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(ts.factory.createIdentifier('Entity'))
);

export const idAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(
    ts.factory.createIdentifier('PrimaryGeneratedColumn'),
    undefined,
    [ts.factory.createStringLiteral('uuid', true)]
  )
);

export const columnAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(ts.factory.createIdentifier('Column'))
);

export const listAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(
    ts.factory.createIdentifier('Get'),
    undefined,
    []
  )
);

export const getAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(
    ts.factory.createIdentifier('Get'),
    undefined,
    [ts.factory.createStringLiteral(':id', true)]
  )
);

export const postAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(
    ts.factory.createIdentifier('Post'),
    undefined,
    []
  )
);

export const deleteAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(
    ts.factory.createIdentifier('Delete'),
    undefined,
    [ts.factory.createStringLiteral(':id', true)]
  )
);

export const idParamAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(
    ts.factory.createIdentifier('Param'),
    undefined,
    [ts.factory.createStringLiteral('id', true)]
  )
);

export const bodyAnnotation = ts.factory.createDecorator(
  ts.factory.createCallExpression(
    ts.factory.createIdentifier('Body'),
    undefined,
    []
  )
);
