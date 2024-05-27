import Flowchart from './components/Flowchart';
import JsonView from './components/JsonView';
import PromptBar from './components/PromptBar';

function App() {
  return (
    <div className="App" style={{height: 'inherit'}}>
      <div style={{height: 'inherit', width: '70%', float: 'left'}}>
        <Flowchart/>
      </div>
      <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <div id='bar-indicator'>
          <PromptBar/>
        </div>
        <div style={{maxHeight: '100vh', overflowY: 'scroll'}}>
          <JsonView />
        </div>
      </div>
    </div>
  );
}

export default App;
