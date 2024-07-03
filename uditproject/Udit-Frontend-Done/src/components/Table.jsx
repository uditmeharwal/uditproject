import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const Table = ({ handleEditModal, usersList, handleDeleteUser }) => {
  const storedData = JSON.parse(localStorage.getItem("token"));

  return (
    <div class="row">
      <div class="col-12">
        <table class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList?.length ? (
              usersList.map((user, index) => (
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>
                    {user.name}{" "}
                    {`${
                      storedData.email === user.email ? "(Logged In User)" : ""
                    }`}
                  </td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      type="button"
                      class="btn btn-success"
                      onClick={() => handleEditModal(user._id)}
                    >
                      <FontAwesomeIcon icon={faEdit} />{" "}
                    </button>
                    <button
                      disabled={storedData.email === user.email}
                      type="button"
                      class="btn btn-danger"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <div className="alert alert-info mt-3 " role="alert">
                No records found.
              </div>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
