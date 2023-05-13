import React, { Fragment, useEffect, useState, useRef } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { DownloadTableExcel } from "react-export-table-to-excel";
import Moment from "moment";
import { Typeahead } from "react-bootstrap-typeahead";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "react-bootstrap-typeahead/css/Typeahead.css";

import {
  DatatableWrapper,
  Filter,
  Pagination,
  PaginationOptions,
  TableBody,
  TableHeader,
} from "react-bs-datatable";

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

  const tableRef = useRef(null);

  const headers = [
    {
      prop: "id",
      title: "Id",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "boxSizeName",
      title: "Box Size",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "producedQuantity",
      title: "Produced Quantity",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "producedDate",
      title: "Produced Date",
      isSortable: true,
      isFilterable: true,
      cell: (row) => Moment(row.producedDate).format("DD MMM YYYY"),
    },
    {
      prop: "button",
      cell: (row) => (
        <button className="btn btn-danger" onClick={() => handleDelete(row.id)}>
          Delete
        </button>
      ),
    },
  ];

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
                filename="Production Sheet Report"
                sheet="Production Sheet"
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
