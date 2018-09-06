const { ResolverList, ResolversByType } = require('../');
const AbstractResolver = require('../AbstractResolver');

test('Resolvers exports', () => {
    expect(ResolverList).toBeInstanceOf(Array);
    expect(
        ResolverList.every(resolver =>
            AbstractResolver.prototype.isPrototypeOf(resolver.prototype)
        )
    ).toBeTruthy();
    expect(ResolversByType).toMatchInlineSnapshot(`
Object {
  "file": [Function],
  "inline": [Function],
  "template": [Function],
}
`);
});
