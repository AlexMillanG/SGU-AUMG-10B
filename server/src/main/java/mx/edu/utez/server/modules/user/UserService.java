package mx.edu.utez.server.modules.user;

import lombok.RequiredArgsConstructor;
import mx.edu.utez.server.utils.ApiResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // CREATE
    public ApiResponseDto createUser(UserEntity user) {
        ApiResponseDto response = new ApiResponseDto();
        try {
            UserEntity savedUser = userRepository.save(user);
            response.setData(savedUser);
            response.setStatus(HttpStatus.CREATED);
            response.setSuccess(true);
            response.setMessage("User created successfully");
        } catch (Exception e) {
            response.setData(null);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setSuccess(false);
            response.setMessage("Error creating user: " + e.getMessage());
        }
        return response;
    }

    // READ ALL
    @Transactional(readOnly = true)
    public ApiResponseDto getAllUsers() {
        ApiResponseDto response = new ApiResponseDto();
        try {
            List<UserEntity> users = userRepository.findAll();
            response.setData(users);
            response.setStatus(HttpStatus.OK);
            response.setSuccess(true);
            response.setMessage("Users retrieved successfully");
        } catch (Exception e) {
            response.setData(null);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setSuccess(false);
            response.setMessage("Error retrieving users: " + e.getMessage());
        }
        return response;
    }

    // READ BY ID
    @Transactional(readOnly = true)
    public ApiResponseDto getUserById(Long id) {
        ApiResponseDto response = new ApiResponseDto();
        try {
            Optional<UserEntity> user = userRepository.findById(id);
            if (user.isPresent()) {
                response.setData(user.get());
                response.setStatus(HttpStatus.OK);
                response.setSuccess(true);
                response.setMessage("User found successfully");
            } else {
                response.setData(null);
                response.setStatus(HttpStatus.NOT_FOUND);
                response.setSuccess(false);
                response.setMessage("User not found with id: " + id);
            }
        } catch (Exception e) {
            response.setData(null);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setSuccess(false);
            response.setMessage("Error retrieving user: " + e.getMessage());
        }
        return response;
    }

    // UPDATE
    public ApiResponseDto updateUser(Long id, UserEntity userDetails) {
        ApiResponseDto response = new ApiResponseDto();
        try {
            Optional<UserEntity> existingUser = userRepository.findById(id);
            if (existingUser.isPresent()) {
                UserEntity user = existingUser.get();
                user.setFullName(userDetails.getFullName());
                user.setEmail(userDetails.getEmail());
                user.setPhone(userDetails.getPhone());
                UserEntity updatedUser = userRepository.save(user);
                response.setData(updatedUser);
                response.setStatus(HttpStatus.OK);
                response.setSuccess(true);
                response.setMessage("User updated successfully");
            } else {
                response.setData(null);
                response.setStatus(HttpStatus.NOT_FOUND);
                response.setSuccess(false);
                response.setMessage("User not found with id: " + id);
            }
        } catch (Exception e) {
            response.setData(null);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setSuccess(false);
            response.setMessage("Error updating user: " + e.getMessage());
        }
        return response;
    }

    // DELETE
    public ApiResponseDto deleteUser(Long id) {
        ApiResponseDto response = new ApiResponseDto();
        try {
            Optional<UserEntity> user = userRepository.findById(id);
            if (user.isPresent()) {
                userRepository.deleteById(id);
                response.setData(null);
                response.setStatus(HttpStatus.OK);
                response.setSuccess(true);
                response.setMessage("User deleted successfully");
            } else {
                response.setData(null);
                response.setStatus(HttpStatus.NOT_FOUND);
                response.setSuccess(false);
                response.setMessage("User not found with id: " + id);
            }
        } catch (Exception e) {
            response.setData(null);
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);
            response.setSuccess(false);
            response.setMessage("Error deleting user: " + e.getMessage());
        }
        return response;
    }
}
