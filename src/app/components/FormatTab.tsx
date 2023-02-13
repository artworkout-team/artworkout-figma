import React, { useState, ChangeEvent } from 'react'
import {
  Stack,
  Button,
  Form,
  Table,
  OverlayTrigger,
  Tooltip,
  Accordion,
} from 'react-bootstrap'
import { emit } from '../../events'
import { pluginApi } from '../../rpc-api'
import { ErrorColor, ErrorLevel, errorsForPrint } from '../../plugin/linter'
import { Circle } from 'react-bootstrap-icons'
import './FormatTab.css'

export function FormatTab() {
  const [textareaValue, setTextareaValue] = useState<string>()
  const [tableValue, setTableValue] = useState<errorsForPrint[]>()
  let lastPageName: string = undefined

  function getLineNumber() {
    let tArea = document.querySelector('#output') as HTMLTextAreaElement
    return tArea.value.substr(0, tArea.selectionStart).split('\n').length
  }

  function selectError(errorIndex?: number) {
    console.log('selectError', errorIndex)
    errorIndex ? pluginApi.selectError(errorIndex) : pluginApi.selectError(getLineNumber()- 1)
  }

  async function exportTexts() {
    setTextareaValue(
      (await pluginApi.exportTexts()).map((s) => `"${s}" = "${s}";`).join('\n')
    )
  }

  async function lintPage() {
    const errors = await pluginApi.onLintPage()
    setTableValue(errors.tableErrors)
    setTextareaValue(errors.textErrors)
    await pluginApi.saveErrors(errors.tableErrors)
  }

  async function lintCourse() {
    const errors = await pluginApi.onLintCourse()
    setTableValue(errors.tableErrors)
    setTextareaValue(errors.textErrors)
    await pluginApi.saveErrors(errors.tableErrors)
  }

  async function importTexts() {
    let errorMessage: string
    const regexp = /^"(.+)"\s*=\s*"(.*)";$/g
    let texts = {}
    textareaValue
      .replace(/\/\*.*?\*\//g, '')
      .split('\n')
      //.map((str) => str.split('//')[0])
      .map((str) => str.trim())
      .filter((str) => str.length > 0)
      .forEach((str) => {
        const match = str.matchAll(regexp).next().value
        if (match) {
          const key = match[1]
          const value = match[2]
          if (!texts[key]) {
            texts[key] = value
          } else {
            errorMessage = `Duplicate key: ${key}`
          }
        } else {
          errorMessage = `Invalid string: ${str}`
        }
      })
    if (errorMessage) {
      await pluginApi.displayNotification(errorMessage)
      return
    }
    await pluginApi.importTexts(texts)
  }

  function handleTextAreaValue(event: ChangeEvent) {
    setTextareaValue((event.target as HTMLTextAreaElement).value)
  }

  async function onCheckBoxChange(index: number) {
    let newTableValue = [...tableValue]
    newTableValue[index].ignore = !newTableValue[index].ignore
    setTableValue(newTableValue)
    await pluginApi.saveErrors(newTableValue)
  }


  const renderTooltip = (error: string) => (
    <Tooltip id="button-tooltip">
      {error}
    </Tooltip>
  )


  function renderLine(line: errorsForPrint, index: number) {
    let rowColor = 'white'
    if (lastPageName !== undefined && line.pageName !== lastPageName) {
      rowColor = '#d3d3d3'
      lastPageName = line.pageName
    }
    return (
      <tr style={{backgroundColor: rowColor }} key={index} onClick={() => selectError(index)}>
        <th>
          <Form.Check type='checkbox' className={'th'} checked={line.ignore} onChange={() => onCheckBoxChange(index)} />
       </th>
        <OverlayTrigger placement='bottom' delay={{show: 250, hide: 400}}  overlay={renderTooltip(ErrorLevel[line.level])}>
          <th className="th">
            <Circle
              size={20}
              style={{ flex: 1, backgroundColor: ErrorColor[line.errorColor], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',  alignSelf: 'center' }}
            />
          </th>
      </OverlayTrigger>
      <OverlayTrigger placement='top' delay={{show: 400, hide: 400}}  overlay={renderTooltip('Page name')}>
      <th className={'th'}>{line.pageName}</th>
        </OverlayTrigger>
      <OverlayTrigger placement='bottom' delay={{show: 250, hide: 400}}  overlay={renderTooltip(line.error)}>
        <th className={'th-error'}>{line.error}</th>
      </OverlayTrigger>
        { line.nodeType ?
          (<OverlayTrigger placement='top' delay={{show: 400, hide: 400}}  overlay={renderTooltip('Node type')}>
            <th className={'th'}>{line.nodeType}</th>
          </OverlayTrigger>)
          : null}
      { line.nodeName ?
        (<OverlayTrigger placement='top' delay={{show: 400, hide: 400}}  overlay={renderTooltip('Node name')}>
          <th className={'th'}>{line.nodeName}</th>
        </OverlayTrigger>)
        : null}
      </tr>
    )
  }

  return (
    <Stack gap={2} className={'stack'} >
      <div className={'content'}>
      <div>
        <Button className='plugin-btn' onClick={() => lintCourse()}>
          Lint course
        </Button>
        <Button className='plugin-btn' onClick={() => lintPage()}>
          Lint page
        </Button>
        <Button className='plugin-btn' onClick={() => emit('autoFormat')}>
          Auto format
        </Button>
        <Button className='plugin-btn' onClick={() => emit('formatOrder')}>
          Format order
        </Button>
        <Button className='plugin-btn' onClick={exportTexts}>
          Export Texts
        </Button>
        <Button className='plugin-btn' onClick={importTexts}>
          Import Texts
        </Button>
      </div>
      <Table hover size="sm">
        <tbody>
          {tableValue?.length ?
            tableValue.map((item, index) => renderLine(item, index))
            :
            <tr> Done  </tr>
          }
        </tbody>
      </Table>
      </div>
      <Accordion className={'text-area-spoiler'}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Text area</Accordion.Header>
          <Accordion.Body>
            <textarea
              value={textareaValue}
              onChange={handleTextAreaValue}
              onClick={() => selectError()}
              id='output'
              style={{ whiteSpace: 'pre', overflow: 'auto' }}
              cols={83}
              rows={18}
            ></textarea>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </Stack>
  )
}
