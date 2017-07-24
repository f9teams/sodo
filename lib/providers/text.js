/* eslint-disable */

class Text {
  constructor() {
    // Initialize the text object with the correct parameters.
    this.name = 'text';
    this.description = 'Text based entry, supports multi line etc';
    this.resources = ['backlog', 'tickets', 'ci', 'cd'];
  }

  // TODO fix this eslint error
  canProvide() { // eslint-disable-line class-methods-use-this
    return true;
  }

  // TODO fix this eslint error
  provide(resourceName, request) { // eslint-disable-line class-methods-use-this
    const args = request.arguments;
    const TextProvider = {
      description: args.description,
      label: args.label,
      // TODO fix this eslint error
      execute: () => list, // eslint-disable-line no-undef
      list: () => ({
        success: true,
        message: 'description',
        info: '',
      }),
      getConfig: () => ({
        resource: resourceName,
        properties: {
          type: 'text',
          description: args.description,
          label: args.label,
        },
      }),
    };

    return TextProvider;
  }
}

module.exports = Text;
