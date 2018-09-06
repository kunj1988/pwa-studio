const AbstractResolver = require('./AbstractResolver');

class ConditionalResolver extends AbstractResolver {
    static get resolverType() {
        return 'conditional';
    }
    static get telltale() {
        return 'when';
    }
    async resolve(definition) {
        if (
            !definition.when ||
            !Array.isArray(definition.when) ||
            definition.when.length === 0
        ) {
            throw new Error(
                `ConditionalResolver must a 'when' list, with at least one matcher.`
            );
        }
        if (!definition.default) {
            throw new Error(
                `ConditionalResolver must have a 'default' condition.`
            );
        }
        this.default = definition.default;

        return this.tryMatchers(definition.when);
    }
    async tryMatchers([top, ...rest]) {
        const regex = new RegExp(top.pattern);
        const candidate = await this.visitor.context.get(top.matches);
        const regexMatch = candidate.match(regex);

        if (regexMatch) {
            const match = regexMatch.reduce((contextMatch, group, index) => {
                contextMatch[`$${index}`] = group;
                return contextMatch;
            }, {});
            this.visitor.context.set('$match', match);
            const yielded = await this.visitor.upward(top, 'use');
            this.visitor.context.forget('$match');
            return yielded;
        }
        if (rest.length === 0) {
            return this.visitor.upward(this, 'default');
        }
        return this.tryMatchers(rest);
    }
}

module.exports = ConditionalResolver;
