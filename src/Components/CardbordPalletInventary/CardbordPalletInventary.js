import React, { Fragment, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CardbordPalletInventary = () => {
  const [validatedCreate, setValidatedCreate] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);

  const handleCloseUseModal = () => setShowUseModal(false);
  const handleShowUseModal = () => setShowUseModal(true);

  const [data, setData] = useState([]);

  const [code, setCode] = useState("");
  const [size, setSize] = useState("");
  const [palletQuantity, setPalletQuantity] = useState("");
  const [provider, setProvider] = useState("");

  const [useId, setUseId] = useState(0);

  const urlBase =
    "https://boxmachineinventary.azurewebsites.net/api/CardbordPalletInventary/";

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(urlBase)
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleSave = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidatedCreate(true);
    } else {
      setValidatedCreate(false);
      const data = {
        code: code,
        size: size,
        palletQuantity: palletQuantity,
        provider: provider,
      };

      axios
        .post(urlBase, data)
        .then((result) => {
          clear();
          getData();
          toast.success("Item has been added.");
        })
        .catch((error) => {
          toast.error(error);
        });
    }
  };

  const handleUse = (id) => {
    handleShowUseModal();
    setUseId(id);
  };

  const handleUseModal = () => {
    axios
      .delete(urlBase + useId)
      .then((result) => {
        if (result.status === 200) {
          clear();
          getData();
          handleCloseUseModal();
          toast.success("Item has been used.");
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setCode("");
    setSize("");
    setPalletQuantity("");
    setProvider("");
  };

  return (
    <Fragment>
      <ToastContainer />
      <br />
      <Container>
        <Form noValidate validated={validatedCreate} onSubmit={handleSave}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationCustom01">
              <Form.Label>Code</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter Code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Code.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="validationCustom02">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter Size"
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Size.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationCustom03">
              <Form.Label>Pallet Quantity</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter Pallet Quantity"
                value={palletQuantity}
                onChange={(e) => {
                  setPalletQuantity(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Pallet Quantity.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="validationCustom04">
              <Form.Label>Provider</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter Provider"
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Provider.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <button className="btn btn-success" type="submit">
            Create
          </button>
        </Form>
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Id</th>
              <th>Code</th>
              <th>Size</th>
              <th>Pallet Quantity</th>
              <th>Provider</th>
              <th>Entry Date</th>
              <th>Used Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.code}</td>
                    <td>{item.size}</td>
                    <td>{item.palletQuantity}</td>
                    <td>{item.provider}</td>
                    <td>
                      {item.entryDate !== null
                        ? Moment(item.entryDate).format("DD MMM YYYY")
                        : ""}
                    </td>
                    <td>
                      {item.usedDate !== null
                        ? Moment(item.usedDate).format("DD MMM YYYY")
                        : ""}
                    </td>
                    <td colSpan={2}>
                      {item.usedDate === null ? (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUse(item.id)}
                        >
                          Use
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>"Loading..."</td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
      <Modal show={showUseModal} onHide={handleCloseUseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Use Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label>Are you sure to use this Item?</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUseModal}>
            Close
          </Button>
          <Button variant="primary" type="submit" onClick={handleUseModal}>
            Use
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default CardbordPalletInventary;
