package com.example.wordle.config;

import com.example.wordle.model.User;
import com.example.wordle.model.Word;
import com.example.wordle.repository.UserRepository;
import com.example.wordle.repository.WordRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {

  @Bean
  CommandLineRunner initDatabase(UserRepository userRepo,
      WordRepository wordRepo,
      PasswordEncoder passwordEncoder) {
    return args -> {

      // Insert Admin if not exists
      if (userRepo.findByUsername("admin").isEmpty()) {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("admin123")); // default password
        admin.setRole(User.Role.ADMIN);
        admin.setCreatedAt(LocalDateTime.now());
        userRepo.save(admin);
        System.out.println("✅ Default admin created: admin / admin123");
      }

      // Insert Player if not exists
      if (userRepo.findByUsername("player").isEmpty()) {
        User player = new User();
        player.setUsername("player");
        player.setPasswordHash(passwordEncoder.encode("player123")); // default password
        player.setRole(User.Role.PLAYER);
        player.setCreatedAt(LocalDateTime.now());
        userRepo.save(player);
        System.out.println("✅ Default player created: player / player123");
      }

      // Insert default word
      if (wordRepo.count() == 0) {
        List<String> defaultWords = List.of(
            "APPLE", "BRAVE", "CLOUD", "DREAM", "EARTH",
            "FLAME", "GRASS", "HOUSE", "JUMPY", "KNIFE",
            "LIGHT", "MUSIC", "NORTH", "OCEAN", "PEARL",
            "QUIET", "RIVER", "STONE", "TREND", "VIVID");

        for (String w : defaultWords) {
          Word word = new Word();
          word.setWord(w);
          word.setIsActive(true);
          word.setCreatedAt(LocalDateTime.now());
          wordRepo.save(word);
        }
        System.out.println("✅ 20 default words inserted.");
      }
    };
  }
}
