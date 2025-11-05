package mx.edu.utez.server.modules.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.edu.utez.server.utils.ApiResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    // CREATE
    @PostMapping
    public ResponseEntity<ApiResponseDto> createUser(@Valid @RequestBody UserDto userDto) {
        UserEntity user = convertDtoToEntity(userDto);
        ApiResponseDto response = userService.createUser(user);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<ApiResponseDto> getAllUsers() {
        ApiResponseDto response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDto> getUserById(@PathVariable Long id) {
        ApiResponseDto response = userService.getUserById(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDto> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserDto userDto) {
        UserEntity user = convertDtoToEntity(userDto);
        ApiResponseDto response = userService.updateUser(id, user);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponseDto> deleteUser(@PathVariable Long id) {
        ApiResponseDto response = userService.deleteUser(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Helper method to convert DTO to Entity
    private UserEntity convertDtoToEntity(UserDto dto) {
        UserEntity entity = new UserEntity();
        entity.setFullName(dto.getFullName());
        entity.setEmail(dto.getEmail());
        entity.setPhone(dto.getPhone());
        return entity;
    }
}
