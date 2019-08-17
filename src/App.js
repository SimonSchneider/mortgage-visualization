import React from 'react';
import SButton from './Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import './App.css';
import { Stage, Layer, Rect, Transformer, Image } from "react-konva";
import useImage from 'use-image';

const FloorPlan = () => {
  const [image] = useImage('/plan.png')
  return <Image image={image} y={10} className="Button" />;
};

const initialRectangles = [];
let rectangleStep = 1;


const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.setNode(shapeRef.current);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={e => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={e => {
          // transformer is changing scale
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: node.width() * scaleX,
            height: node.height() * scaleY
          });
        }}
      />
      {isSelected && <Transformer keepRatio={false} ref={trRef} />}
    </React.Fragment>
  );
};

function calculateOwners() {
  let sqm = 69
  let value = 75_000
  let owners = [
    {
      name: "Bank",
      ownership: 54_000,
      props: {
        fill: "red",
      },
    },
    {
      name: "Simon's parents",
      ownership: 2_000,
      props: {
        fill: "yellow"
      },
    }
  ]
  owners.push({
    name: "Simon & Wife",
    ownership: value - owners.map(o => o.ownership).reduce((a, b) => a + b, 0),
    props: {
      fill: "green",
    }
  })
  let props = owners.map(a => {
    a.share = a.ownership / value
    a.sqm = a.share * sqm
    return a
  }).sort((a, b) => a.share - b.share)
  console.log(props)
  return props
};

function calculateRectangles(rects, owners) {
  let totalSize = rects.map(r => r.width * r.height).reduce((a, b) => a + b, 0);
  var i = 0;
  var usedWidth = 0;
  if (rects.length == 0) {
    return []
  }
  let test = owners.flatMap(o => {
    let pixels = o.share * totalSize
    let rectsToReturn = []
    do {
      let width = Math.floor(pixels / rects[i].height)
      let start = rects[i].x + usedWidth
      let end = rects[i].x + rects[i].width
      let remainingWidth = end - start
      let rect1 = rectFor(start, rects[i].y, rects[i].height, width < remainingWidth ? width : remainingWidth, o.props)
      rectsToReturn.push(rect1)
      if (width > remainingWidth) {
        pixels = pixels - rects[i].height * remainingWidth
        i++
        usedWidth = 0
      } else {
        usedWidth += width
        pixels = 0
      }
    } while (pixels > 0)
    return rectsToReturn
  })
  console.log(test)
  console.log(test.map(o => o.width).reduce((a, b) => a + b))
  return test
};

function rectFor(x, y, height, width, props) {
  let pr = JSON.parse(JSON.stringify(props))
  pr.x = x
  pr.y = y
  pr.height = height
  pr.width = width
  pr.opacity = 0.5
  return pr
}

const ownerRectangles = []
const initialWidth = window.innerWidth
const initialHeight = window.innerHeight

const App = () => {
  const [rectangles, setRectangles] = React.useState(initialRectangles);
  const [oRects, setORects] = React.useState(ownerRectangles)
  const [selectedId, selectShape] = React.useState(null);
  const [width, setWidth] = React.useState(initialWidth)
  const [height, setHeight] = React.useState(initialHeight)
  return (
    <div className="App">
      <header className="App-header">
        <p>Apartment ownership</p>
      </header>
      <Container>
        <Row className="justify-content-md-center">
          <Col md="auto">
            <SButton
              onClick={() => {
                let owners = calculateOwners();
                let rects = calculateRectangles(rectangles, owners);
                setORects(rects);
                setRectangles(rectangles.map(r => {
                  r.opacity = 0
                  return r
                }))
                selectShape(null)
              }}
              text="Calculate" />
          </Col>
          <Col md="auto">
            <SButton
              onClick={() => {
                rectangleStep += 1
                const newRect = {
                  x: 10,
                  y: 10,
                  width: 100,
                  height: 100,
                  fill: "gray",
                  opacity: 0.5,
                  id: "rect" + rectangleStep
                }
                setRectangles(rectangles.concat(newRect))
              }}
              text="New Rectangle"
            />
          </Col>
          <Col md="auto">
            <SButton
              onClick={() => {
                setRectangles(rectangles.map(r => {
                  r.opacity = r.opacity == 0 ? 0.5 : 0
                  return r
                }))
              }}
              text="Toggle Rectangles" />
          </Col>
        </Row>
        <Row id="stageParent" className="justify-content-md-center">
          <Col md="auto">
            <Stage
              width={550}
              height={400}
              onMouseDown={e => {
                // deselect when clicked on empty area
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                  selectShape(null);
                }
              }}>
              <Layer>
                <FloorPlan />
                {oRects.map((rect, i) => {
                  return (
                    <Rectangle
                      key={i + 199}
                      shapeProps={rect}
                    />
                  );
                })}
                {rectangles.map((rect, i) => {
                  return (
                    <Rectangle
                      key={i}
                      label="bla"
                      shapeProps={rect}
                      isSelected={rect.id === selectedId}
                      onSelect={() => {
                        selectShape(rect.id);
                      }}
                      onChange={newAttrs => {
                        const rects = rectangles.slice();
                        rects[i] = newAttrs;
                        setRectangles(rects);
                      }
                      } />
                  );
                })}
              </Layer>
            </Stage>
          </Col>
        </Row>
        <Container>
          {calculateOwners().map(o => {
            return (
              <Row className="mt-1">
                <Col>{o.name}</Col>
                <Col>{o.ownership} SEK</Col>
                <Col>{Math.floor(o.sqm * 100) / 100} m&sup2;</Col>
                <Col>{Math.floor(o.share * 10000) / 100} %</Col>
                <Col md="auto"><div className="Legend" style={{ backgroundColor: `${o.props.fill}` }} /></Col>
              </Row>
            )
          })}
        </Container>
      </Container>
    </div>
  );
};

export default App;
