package com.project.server.service;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UploadService {
    Cloudinary cloudinary;

    // Danh sách các loại file được phép upload
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "jpg", "jpeg", "png", "gif", "pdf", "docx", "xlsx", "pptx", "txt", "mp4", "avi", "mov", "mkv");

    public String uploadFile(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        String[] fileNameParts = getFileName(file.getOriginalFilename());
        String extension = fileNameParts[1].toLowerCase();

        // Kiểm tra loại file
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new IllegalArgumentException("File type not supported: " + extension);
        }

        String publicValue = generatePublicValue(file.getOriginalFilename());
        File fileUpload = convert(file);

        // Xác định resource_type
        String resourceType = isImage(extension) ? "image" : "raw";

        cloudinary
                .uploader()
                .upload(
                        fileUpload,
                        ObjectUtils.asMap(
                                "public_id", publicValue,
                                "resource_type", resourceType));
        cleanDisk(fileUpload);

        // Tạo url đúng resource_type
        String url =
                cloudinary.url().resourceType(resourceType).generate(StringUtils.join(publicValue, ".", extension));
        return url;
    }

    public String generatePublicValue(String originalName) {
        String fileName = getFileName(originalName)[0];
        return StringUtils.join(UUID.randomUUID().toString(), "_", fileName);
    }

    public String[] getFileName(String originalName) {
        int lastDot = originalName.lastIndexOf('.');
        if (lastDot == -1) return new String[] {originalName, ""};
        return new String[] {originalName.substring(0, lastDot), originalName.substring(lastDot + 1)};
    }

    private boolean isImage(String ext) {
        return Arrays.asList("jpg", "jpeg", "png", "gif").contains(ext);
    }

    private File convert(MultipartFile file) throws IOException {
        assert file.getOriginalFilename() != null;
        String[] fileNameParts = getFileName(file.getOriginalFilename());
        File convertFile =
                new File(StringUtils.join(generatePublicValue(file.getOriginalFilename()), ".", fileNameParts[1]));
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, convertFile.toPath());
        }
        return convertFile;
    }

    private void cleanDisk(File file) {
        try {
            Path filePath = file.toPath();
            Files.delete(filePath);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
