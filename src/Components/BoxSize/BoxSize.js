import React, { Fragment, useEffect, useState, useRef } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "../../axiosConfig"; // Ruta al archivo de configuración de Axios
import { DownloadTableExcel } from "react-export-table-to-excel";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

const BoxSize = () => {
  const [disable, setDisable] = useState(false);
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

  const [editId, setEditId] = useState(0);
  const [editCode, setEditCode] = useState("");
  const [editDetailDescription, setEditDetailDescription] = useState("");

  const [deleteId, setDeleteId] = useState(0);

  const tableRef = useRef(null);

  const headers = [
    {
      prop: "id",
      title: "Id",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "code",
      title: "Code",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "detailDescription",
      title: "Detail Description",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "button",
      cell: (row) => (
        <ButtonGroup aria-label="Basic example">
          <Button
            className="btn btn-primary"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </Button>
          <Button
            className="btn btn-danger"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </Button>
        </ButtonGroup>
      ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      axios
        .get("/BoxSize/")
        .then((result) => {
          setData(result.data);
        })
        .catch((error) => {
          toast.error(error);
        });
      // const response = await fetch(urlBase, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     // Otros encabezados si es necesario
      //   }
      // });

      // if (response.ok) {
      //   const data = await response.json();
      //   setData(data);
      // } else {
      //   throw new Error('Error al obtener los datos');
      // }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    const dataEdit = data.filter((item) => item.id === id);
    setEditId(dataEdit[0].id);
    setEditCode(dataEdit[0].code);
    setEditDetailDescription(dataEdit[0].detailDescription);
    handleShow();

    // axios
    //   .get("/BoxSize/" + id)
    //   .then((result) => {
    //     setEditCode(result.data.code);
    //     setEditDetailDescription(result.data.detailDescription);
    //     setEditId(result.data.id);
    //   })
    //   .catch((error) => {
    //     toast.error(error);
    //   });
  };

  const handleUpdate = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (form.checkValidity() === false) {
      setValidatedUpdate(true);
    } else {
      setDisable(true);
      setValidatedUpdate(false);
      const dataEdit = {
        id: editId,
        code: editCode,
        detailDescription: editDetailDescription,
      };

      axios
        .put(`/BoxSize/?id=${editId}`, dataEdit)
        .then((result) => {
          // console.log(result);
          clear();
          setDisable(false);
          setData((data) =>
            data.map((item) =>
              item.id === editId
                ? {
                    ...item,
                    code: editCode,
                    detailDescription: editDetailDescription,
                  }
                : item
            )
          );
          handleClose();
          toast.success("Item has been updated.");
        })
        .catch((error) => {
          setDisable(false);
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
      setDisable(true);
      setValidatedCreate(false);
      const data = {
        code: code,
        detailDescription: detailDescription,
      };

      axios
        .post("/BoxSize/", data)
        .then((result) => {
          setDisable(false);
          clear();
          setData((current) => [...current, result.data]);
          toast.success("Item has been added.");
        })
        .catch((error) => {
          setDisable(false);
          toast.error(error);
        });
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    handleShowDeleteModal();
  };

  const handleDeleteModal = () => {
    setDisable(true);
    axios
      .delete("/BoxSize/" + deleteId)
      .then((result) => {
        if (result.status === 200) {
          clear();
          setDisable(false);
          setData(data.filter((item) => item.id !== deleteId));
          handleCloseDeleteModal();
          toast.success("Item has been deleted.");
        }
      })
      .catch((error) => {
        setDisable(false);
        toast.error(error);
      });
  };

  const clear = () => {
    setCode("");
    setDetailDescription("");
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
          <Button disabled={disable} className="btn btn-success" type="submit">
            Create
          </Button>
        </Form>
        <br />
        <DatatableWrapper
          body={data}
          headers={headers}
          alwaysShowPagination
          paginationOptionsProps={{
            initialState: {
              rowsPerPage: 5,
              options: [5, 10, 15, 20],
            },
          }}
        >
          <Row className="mb-4 p-2">
            <Col
              xs={12}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <Filter />
            </Col>
            <Col
              xs={12}
              sm={3}
              lg={2}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <DownloadTableExcel
                filename="Box Size Report"
                sheet="Box Size"
                currentTableRef={tableRef.current}
              >
                <Button className="btn btn-primary">Export Excel</Button>
              </DownloadTableExcel>
            </Col>
            <Col
              xs={12}
              sm={3}
              lg={2}
              className="d-flex flex-col justify-content-lg-center align-items-center justify-content-sm-start mb-2 mb-sm-0"
            >
              <PaginationOptions />
            </Col>
            <Col
              xs={12}
              sm={6}
              lg={4}
              className="d-flex flex-col justify-content-end align-items-end"
            >
              <Pagination />
            </Col>
          </Row>
          <Table ref={tableRef}>
            <TableHeader />
            <TableBody />
          </Table>
        </DatatableWrapper>
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
          <Button
            disabled={disable}
            variant="primary"
            type="submit"
            form="formModal1"
          >
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
            disabled={disable}
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

export default BoxSize;
