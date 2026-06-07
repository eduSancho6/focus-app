import 'package:supabase_flutter/supabase_flutter.dart';

class AuthService {
  final SupabaseClient _client;

  AuthService(this._client);

  SupabaseClient get client => _client;
  Session? get currentSession => _client.auth.currentSession;
  User? get currentUser => _client.auth.currentUser;

  String? get accessToken => currentSession?.accessToken;

  Stream<AuthState> get onAuthStateChange => _client.auth.onAuthStateChange;

  Future<AuthResponse> signUp(String email, String password) {
    return _client.auth.signUp(password: password, email: email);
  }

  Future<AuthResponse> signIn(String email, String password) {
    return _client.auth.signInWithPassword(password: password, email: email);
  }

  Future<void> signOut() {
    return _client.auth.signOut();
  }
}
