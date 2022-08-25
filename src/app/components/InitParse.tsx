import Parse from 'parse'
import StorageController from '../../../node_modules/parse/lib/browser/StorageController.default'

export default function InitParse() {
  (Parse.CoreManager as any).setStorageController(StorageController)
  Parse.initialize('artworkout-parse')
  Parse.serverURL = 'https://artworkout-parse.momwillbeproud.com/parse'
}
