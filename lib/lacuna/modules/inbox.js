'use strict'

let Module = require('../module')

class Inbox extends Module {
  constructor () {
    super()

    this.apiMethods('inbox', [
      'archive_messages',
      'read_message',
      'send_message',
      'trash_messages_where',
      'trash_messages',
      'view_archived',
      'view_inbox',
      'view_sent',
      'view_trashed'
    ])
  }
}

module.exports = Inbox
