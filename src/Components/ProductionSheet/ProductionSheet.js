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
import { Typeahead } from "react-bootstrap-typeahead";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

const ProductionSheet = () => {
  const [validatedCreate, setValidatedCreate] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const [data, setData] = useState([]);
  const [dataBoxSize, setDataBoxSize] = useState([]);

  const [boxSizeId, setBoxSizeId] = useState("");
  const [producedQuantity, setProducedQuantity] = useState("");

  const [deleteId, setDeleteId] = useState(0);

  const [singleSelections, setSingleSelections] = useState([]);

  const urlBase =
    "https://boxmachineinventary.azurewebsites.net/api/BoxMachineProductionSheet/";
  const urlBaseBoxSize =
    "https://boxmachineinventary.azurewebsites.net/api/BoxSize/";

  useEffect(() => {
    getData();
    getDataBoxSize();
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

  const getDataBoxSize = () => {
    axios
      .get(urlBaseBoxSize)
      .then((result) => {
        const dataNew = result.data.map((item) => ({
          id: item.id,
          name: item.code + " - " + item.detailDescription,
        }));
        setDataBoxSize(dataNew);
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
        boxSizeId: boxSizeId,
        producedQuantity: producedQuantity,
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

  const handleDelete = (id) => {
    handleShowDeleteModal();
    setDeleteId(id);
  };

  const handleDeleteModal = () => {
    axios
      .delete(urlBase + deleteId)
      .then((result) => {
        if (result.status === 200) {
          clear();
          getData();
          handleCloseDeleteModal();
          toast.success("Item has been deleted.");
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const clear = () => {
    setBoxSizeId("");
    setProducedQuantity("");
    setSingleSelections([]);
  };

  return (
    <Fragment>
      <ToastContainer />
      <br />
      <Container>
        <Form noValidate validated={validatedCreate} onSubmit={handleSave}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationCustom02">
              <Form.Label>Box Size</Form.Label>
              <Typeahead
                id="basic-typeahead-single"
                labelKey="name"
                onChange={(selected) => {
                  setBoxSizeId(selected[0].id);
                  setSingleSelections(selected);
                }}
                options={dataBoxSize}
                placeholder="Choose a Box Size..."
                selected={singleSelections}
                // required
              />
              {/* <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter BoxSizeId"
                value={boxSizeId}
                onChange={(e) => {
                  setBoxSizeId(e.target.value);
                }}
                required
              /> */}
              <Form.Control.Feedback type="invalid">
                Please provide a valid BoxSizeId.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="validationCustom02">
              <Form.Label>Produced Quantity</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter Produced Quantity"
                value={producedQuantity}
                onChange={(e) => {
                  setProducedQuantity(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Produced Quantity.
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
              <th>Box Size</th>
              <th>Produced Quantity</th>
              <th>Produced Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.boxSizeName}</td>
                    <td>{item.producedQuantity}</td>
                    <td>{Moment(item.producedDate).format("DD MMM YYYY")}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
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
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label>Are you sure to delete this Item?</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            onClick={handleDeleteModal}
            className="btn btn-danger"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default ProductionSheet;
