import axios from 'axios';

// Create an axios instance for base configuration
  export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true, // Important for auth cookies
});


export const userService = {
  async getAllUsers() {
    try {
      const response = await apiClient.get('/api/admin/getAllUsers');
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  } ,
  async getAllBookings( ) {
    try {
      const response = await apiClient.get('/api/admin/getAllBookings');
      console.log("Full Response:", response); 
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  } ,
  async getAllUsersData() {
    try {
      const response = await apiClient.get('/api/admin/summary');
      return response.data;
    } catch (error) {
      console.error("Error fetching users data:", error);
      throw error;
    }
  } , 
  async deleteBooking(id: string) {
  try {
    const response = await apiClient.delete(`/api/user/deleteBooking/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
},
  async createUser(userData: { name: string; email: string; password: string; role: string }) {
    try {
      const response = await apiClient.post('/api/admin/createUser', userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },
  async changeUserRole(userId: string, role: string) {
    try {
      const response = await apiClient.post(`/api/admin/changeUserRole/${userId}`, { role });
      return response.data;
    } catch (error) {
      console.error("Error changing user role:", error);
      throw error;
    }
  },
  async deleteUser(userId: string) {
    try {
      const response = await apiClient.delete(`/api/admin/deleteUser/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
};