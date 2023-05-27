import React, { Fragment, useEffect, useState, useRef } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import axios from "../../axiosConfig"; // Ruta al archivo de configuración de Axios
import { DownloadTableExcel } from "react-export-table-to-excel";
import Moment from "moment";
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

const CardbordPalletInventary = () => {
  const [disable, setDisable] = useState(false);
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
      prop: "size",
      title: "Size",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "palletQuantity",
      title: "Pallet Quantity",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "provider",
      title: "Provider",
      isSortable: true,
      isFilterable: true,
    },
    {
      prop: "EntryDate",
      title: "Entry Date",
      isSortable: true,
      isFilterable: true,
      cell: (row) =>
        row.entryDate !== null
          ? Moment(row.entryDate).format("DD MMM YYYY")
          : "",
    },
    {
      prop: "usedDate",
      title: "Used Date",
      isSortable: true,
      isFilterable: true,
      cell: (row) =>
        row.usedDate !== null ? Moment(row.usedDate).format("DD MMM YYYY") : "",
    },
    {
      prop: "button",
      cell: (row) =>
        row.usedDate === null ? (
          <button className="btn btn-primary" onClick={() => handleUse(row.id)}>
            Use
          </button>
        ) : (
          ""
        ),
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get("/CardbordPalletInventary/")
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
      setDisable(true);
      setValidatedCreate(false);
      const data = {
        code: code,
        size: size,
        palletQuantity: palletQuantity,
        provider: provider,
      };

      axios
        .post("/CardbordPalletInventary/", data)
        .then((result) => {
          clear();
          setDisable(false);
          setData((current) => [...current, result.data]);
          toast.success("Item has been added.");
        })
        .catch((error) => {
          setDisable(false);
          toast.error(error);
        });
    }
  };

  const handleUse = (id) => {
    handleShowUseModal();
    setUseId(id);
  };

  const handleUseModal = () => {
    setDisable(true);
    axios
      .delete("/CardbordPalletInventary/" + useId)
      .then((result) => {
        if (result.status === 200) {
          clear();
          getData();
          setDisable(false);
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
                filename="Cardbord Pallet Inventary Report"
                sheet="Cardbord Pallet Inventary"
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
          <Button
            disabled={disable}
            variant="primary"
            type="submit"
            onClick={handleUseModal}
          >
            Use
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default CardbordPalletInventary;
