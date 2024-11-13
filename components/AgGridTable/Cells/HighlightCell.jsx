import Highlighter from 'react-highlight-words'
import TruncatedText from '../../TruncatedText'

const HighlightCell = ({ data, rowIndex, type, st: searchTerm, shop }) => {
  return (
    <TruncatedText>
      <Highlighter
        highlightClassName='highlighter'
        id={`${type}-${rowIndex}`}
        searchWords={searchTerm ? searchTerm.split(' ') : []}
        autoEscape
        textToHighlight={!shop ? data?.[type]?.toString() : data?.[type]?.name ? data?.[type]?.name : data?.[type]}
        style={{ whiteSpace: 'pre-line' }}
        className='highlighter-preline'
      />
    </TruncatedText>
  )
}

export default HighlightCell
