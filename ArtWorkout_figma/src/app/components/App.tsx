import React, { useEffect, useState } from 'react'
import {emit, on, once} from '../../events'
import {Tabs, Tab, Form, Button, Stack, Row, Col} from "react-bootstrap";
import CourseExporter from "./CourseExporter";
import 'bootstrap/dist/css/bootstrap.min.css';
import DisplayForm from './DisplayForm';

function App() {
  const [textareaValue, setTextareaValue] = useState("");
  useEffect(() => {
    return on("print", setTextareaValue)
  })

  function getLineNumber() {
    let tArea = document.querySelector("#output") as HTMLTextAreaElement;
    return tArea.value.substr(0, tArea.selectionStart).split("\n").length;
  }

  function selectError() {
    emit("selectError", getLineNumber() - 1)
  }

  return (
    <Tabs defaultActiveKey="tune" className="m-1">
      <Tab eventKey="create" title="Create" className="m-2">
        {/* <Button>Create lesson</Button> */}
        {/* <Button>Set animations (CONFIRM)</Button> */}
        <Button onClick={() => emit("separateStep")}>Separate step</Button>
      </Tab>

      <Tab eventKey="tune" title="Tune" className="m-2">
        <DisplayForm/>
      </Tab>

      <Tab eventKey="format" title="Format" className="m-2">
        <Stack gap={2}>
          <div>
            <Button onClick={() => emit("lintCourse")}>Lint course</Button>
            <Button onClick={() => emit("lintPage")} className='mx-1'>Lint page</Button>
            <Button onClick={() => emit("autoFormat")}>Auto format</Button>
          </div>
          <textarea value={textareaValue} onChange={()=>{}} onClick={selectError} id="output" style={{whiteSpace: "pre",  overflow: "auto"}} cols={83} rows={18}></textarea>
        </Stack>
      </Tab>

      <Tab eventKey="publish" title="Publish" className="m-2">
        <Button onClick={() => emit("exportCourse")}>Export course</Button>
        <CourseExporter/>
        <Button onClick={() => emit("generateCode")} className='mx-1'>Generate code</Button>
        {/* upload course, login-password */}
      </Tab>
    </Tabs>
  )
}

export default App
