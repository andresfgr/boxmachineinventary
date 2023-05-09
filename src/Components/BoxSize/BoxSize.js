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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BoxSizeComponent = () => {
  const [validatedCreate, setValidatedCreate] = useState(false);
  const [validatedUpdate, setValidatedUpdate] = useState(false);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);

  const [data, setData] = useState([]);

  const [code, setCode] = useState("");
  const [detailDescription, setDetailDescription] = useState("");
  // const [isActive, setIsActive] = useState(0);

  const [editId, setEditId] = useState(0);
  const [editCode, setEditCode] = useState("");
  const [editDetailDescription, setEditDetailDescription] = useState("");
  // const [editIsActive, setEditIsActive] = useState(0);

  const [deleteId, setDeleteId] = useState(0);

  const urlBase = "https://boxmachineinventary.azurewebsites.net/api/BoxSize/";

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

  const handleEdit = (id) => {
    handleShow();
    axios
      .get(urlBase + id)
      .then((result) => {
        setEditCode(result.data.code);
        setEditDetailDescription(result.data.detailDescription);
        // setEditIsActive(result.data.isActive);
        setEditId(result.data.id);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleUpdate = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidatedUpdate(true);
    } else {
      setValidatedUpdate(false);
      const data = {
        id: editId,
        code: editCode,
        detailDescription: editDetailDescription,
        // isActive: editIsActive,
      };

      axios
        .put(urlBase + `?id=${editId}`, data)
        .then((result) => {
          clear();
          getData();
          handleClose();
          toast.success("Item has been updated.");
        })
        .catch((error) => {
          toast.error(error);
        });
    }
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
        detailDescription: detailDescription,
        // isActive: isActive,
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
    setCode("");
    setDetailDescription("");
    // setIsActive(0);
    setEditId(0);
    setEditCode("");
    setEditDetailDescription("");
  };

  return (
    <Fragment>
      <ToastContainer />
      <br />
      <Container>
        <Form noValidate validated={validatedCreate} onSubmit={handleSave}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="validationCustom02">
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
              <Form.Label>Detail Description</Form.Label>
              <Form.Control
                type="text"
                className="form-control"
                placeholder="Enter Detail Description"
                value={detailDescription}
                onChange={(e) => {
                  setDetailDescription(e.target.value);
                }}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Detail Description.
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
              <th>ID</th>
              <th>Code</th>
              <th>Detail Description</th>
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
                    <td>{item.detailDescription}</td>
                    <td colSpan={2}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleEdit(item.id)}
                      >
                        Edit
                      </button>{" "}
                      &nbsp;
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
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modify / Update Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validatedUpdate}
            onSubmit={handleUpdate}
            id="formModal1"
          >
            <Row>
              <Form.Group as={Col} controlId="validationIdMDL">
                <Form.Label>Id</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  value={editId}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col} controlId="validationCodeMDL">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  placeholder="Enter Code"
                  value={editCode}
                  onChange={(e) => {
                    setEditCode(e.target.value);
                  }}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Code.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} controlId="validationDetailDescriptionMDL">
                <Form.Label>Detail Description</Form.Label>
                <Form.Control
                  type="text"
                  className="form-control"
                  placeholder="Enter Detail Description"
                  value={editDetailDescription}
                  onChange={(e) => {
                    setEditDetailDescription(e.target.value);
                  }}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Detail Description.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" type="submit" form="formModal1">
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
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

export default BoxSizeComponent;
