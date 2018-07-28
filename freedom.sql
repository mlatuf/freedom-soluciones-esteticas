-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-06-2018 a las 21:49:59
-- Versión del servidor: 5.6.17
-- Versión de PHP: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `freedom`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointment`
--

CREATE TABLE IF NOT EXISTS `appointment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `IdCenter` int(11) DEFAULT NULL,
  `idPatient` int(11) NOT NULL,
  `idDay` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `price` float NOT NULL DEFAULT '0',
  `comments` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idPatient` (`idPatient`),
  KEY `idDay` (`idDay`),
  KEY `idCenter` (`IdCenter`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=27 ;

--
-- Volcado de datos para la tabla `appointment`
--

INSERT INTO `appointment` (`id`, `IdCenter`, `idPatient`, `idDay`, `status`, `startTime`, `endTime`, `price`, `comments`) VALUES
(26, NULL, 3, 1, 0, '07:30:00', '08:10:00', 1600, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `appointment_area`
--

CREATE TABLE IF NOT EXISTS `appointment_area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idAppointment` int(11) NOT NULL,
  `idArea` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idArea` (`idArea`),
  KEY `idAppointment` (`idAppointment`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=35 ;

--
-- Volcado de datos para la tabla `appointment_area`
--

INSERT INTO `appointment_area` (`id`, `idAppointment`, `idArea`) VALUES
(31, 26, 3),
(32, 26, 5),
(33, 26, 7),
(34, 26, 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `area`
--

CREATE TABLE IF NOT EXISTS `area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `IdCenter` int(11) DEFAULT NULL,
  `description` varchar(45) NOT NULL,
  `price` varchar(45) DEFAULT NULL,
  `duration` int(10) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCenter` (`IdCenter`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=20 ;

--
-- Volcado de datos para la tabla `area`
--

INSERT INTO `area` (`id`, `IdCenter`, `description`, `price`, `duration`) VALUES
(3, NULL, 'Menton', '200', 1),
(4, NULL, 'Bozo', '200', 1),
(5, NULL, 'Cejas', '200', 1),
(6, NULL, 'Rostro', '400', 1),
(7, NULL, 'Axilas', '500', 1),
(8, NULL, 'Cavado bikini', '550', 1),
(9, NULL, 'Cavado completo', '700', 1),
(10, NULL, 'Media pierna alta', '900', 1),
(11, NULL, 'Media pierna baja', '800', 1),
(12, NULL, 'Pierna entera', '600', 1),
(13, NULL, 'Brazos', '500', 1),
(14, NULL, 'Cavado bikini + axilas', '700', 1),
(15, NULL, 'Cavado completo + axilas', '900', 1),
(16, NULL, 'Media pierna + cavado bikini + axilas', '1000', 1),
(17, NULL, 'Media pierna + cavado completo + axilas', '1000', 1),
(18, NULL, 'Pierna entera + cavado completo + axilas', '1000', 1),
(19, NULL, 'Media pierna + cavado bikini + axilas', '1000', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `center`
--

CREATE TABLE IF NOT EXISTS `center` (
  `Id` int(255) NOT NULL AUTO_INCREMENT,
  `Name` varchar(500) NOT NULL,
  `Address` varchar(500) NOT NULL,
  `IdUser` int(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `day`
--

CREATE TABLE IF NOT EXISTS `day` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `startTime` time DEFAULT NULL,
  `endTime` time DEFAULT NULL,
  `step` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `day`
--

INSERT INTO `day` (`id`, `date`, `startTime`, `endTime`, `step`) VALUES
(1, '2016-07-30', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migration`
--

CREATE TABLE IF NOT EXISTS `migration` (
  `version` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `migration`
--

INSERT INTO `migration` (`version`, `apply_time`) VALUES
('m000000_000000_base', 1521902481),
('m130524_201442_init', 1521902484);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `patient`
--

CREATE TABLE IF NOT EXISTS `patient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `phone` int(11) DEFAULT NULL,
  `facebookContact` varchar(45) DEFAULT NULL,
  `IdCenter` int(11) DEFAULT NULL,
  `idPartner` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idCenter` (`id`),
  KEY `idPartner` (`idPartner`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=77 ;

--
-- Volcado de datos para la tabla `patient`
--

INSERT INTO `patient` (`id`, `name`, `lastName`, `phone`, `facebookContact`, `IdCenter`, `idPartner`) VALUES
(1, 'Paciente 1', 'Paciente 1', NULL, 'paciente.1', NULL, 0),
(2, 'Paciente 2', 'Paciente 2', NULL, 'paciente.2', NULL, 0),
(3, 'Virginia', 'Dalzovo', 1111111, 'Virginia.Dalzovo', NULL, 0),
(4, 'Anabela', 'Becchi', 2222222, 'facebook', NULL, 0),
(5, 'Maria', 'Jose Pastor', 2222222, 'facebook', NULL, 0),
(6, 'Pamela', 'Beloqui', 2222222, 'facebook', NULL, 0),
(7, 'Soledad', 'Lopez', 2222222, 'facebook', NULL, 0),
(8, 'Maru', 'Gonzalez Guerra', 2222222, 'facebook', NULL, 0),
(9, 'Delfina', 'Marcovecchio', 2222222, 'facebook', NULL, 0),
(10, 'Maru', 'Gonzalez Guerra', 2222222, 'facebook', NULL, 0),
(11, 'Delfina', 'Marcovecchio', 2222222, 'facebook', NULL, 0),
(12, 'Maru', 'Gonzalez Guerra', 2222222, 'facebook', NULL, 0),
(13, 'Delfina', 'Marcovecchio', 2222222, 'facebook', NULL, 0),
(14, 'Maria Jose', 'Thomas', 2222222, 'facebook', NULL, 0),
(15, 'Sofia', 'Barsotini', 2222222, 'facebook', NULL, 0),
(16, 'Lujan', 'Garcia Etulain', 2222222, 'facebook', NULL, 0),
(17, 'Belen', 'Santurio', 2222222, 'facebook', NULL, 0),
(18, 'Liliana', 'Vera', 2222222, 'facebook', NULL, 0),
(19, 'Florencia', 'Mortati', 2222222, 'facebook', NULL, 0),
(20, 'Daniela', 'Sanabria', 2222222, 'facebook', NULL, 0),
(21, 'Agustina', 'Mena', 2222222, 'facebook', NULL, 0),
(22, 'Bernardita', 'Fernandez', 2222222, 'facebook', NULL, 0),
(23, 'Mailen', 'Rampoldi', 2222222, 'facebook', NULL, 0),
(24, 'Laura', 'Barrena', 2222222, 'facebook', NULL, 0),
(25, 'Claudia', 'Zanazzi', 2222222, 'facebook', NULL, 0),
(26, 'Graciela', 'Valcarce', 2222222, 'facebook', NULL, 0),
(27, 'Romina', 'del Buono', 2222222, 'facebook', NULL, 0),
(28, 'Andrea', 'Bertora', 2222222, 'facebook', NULL, 0),
(29, 'Nerina', 'Guisolis', 2222222, 'facebook', NULL, 0),
(30, 'Mariana', 'Saraca', 2222222, 'facebook', NULL, 0),
(31, 'Sandra', 'Elizain', 2222222, 'facebook', NULL, 0),
(32, 'Malena', 'Malena', 2222222, 'facebook', NULL, 0),
(33, 'Paola', 'Jaramillo', 2222222, 'facebook', NULL, 0),
(34, 'Belen', 'Alvarez', 2222222, 'facebook', NULL, 0),
(35, 'Victoria', 'Dallavia', 2222222, 'facebook', NULL, 0),
(36, 'Victoria', 'Alberdi', 2222222, 'facebook', NULL, 0),
(37, 'Camila', 'Fuentes', 2222222, 'facebook', NULL, 0),
(38, 'Nadia', 'Pais', 2222222, 'facebook', NULL, 0),
(39, 'Paz', 'Zabaleta', 2222222, 'facebook', NULL, 0),
(40, 'Pia', 'Zabaleta', 2222222, 'facebook', NULL, 0),
(41, 'Marcela', 'Nibaldi', 2222222, 'facebook', NULL, 0),
(42, 'Natalia', 'Belen', 2222222, 'facebook', NULL, 0),
(43, 'Marina', 'Saavedra', 2222222, 'facebook', NULL, 0),
(44, 'Vanesa', 'Celentano', 2222222, 'facebook', NULL, 0),
(45, 'Maricel', 'Collela', 2222222, 'facebook', NULL, 0),
(46, 'Monica', 'Villavona', 2222222, 'facebook', NULL, 0),
(47, 'Nancy', 'Machi', 2222222, 'facebook', NULL, 0),
(48, 'Lucrecia', 'Ruiz', 2222222, 'facebook', NULL, 0),
(49, 'Eugenia', 'Vargas', 2222222, 'facebook', NULL, 0),
(50, 'Ana', 'Albanese', 2222222, 'facebook', NULL, 0),
(51, 'Eugenia', 'Trueba', 2222222, 'facebook', NULL, 0),
(52, 'Laura', 'Fernandez', 2222222, 'facebook', NULL, 0),
(53, 'Julieta', 'de fabio', 2222222, 'facebook', NULL, 0),
(54, 'Evangelina', 'Moller', 2222222, 'facebook', NULL, 0),
(55, 'Florencia', 'Ramil', 2222222, 'facebook', NULL, 0),
(56, 'Mariana', 'Camaño', 2222222, 'facebook', NULL, 0),
(57, 'Mercedes', 'Jarque', 2222222, 'facebook', NULL, 0),
(58, 'Bernardita', 'Henderson', 2222222, 'facebook', NULL, 0),
(59, 'Jaquelina', 'Orsi', 2222222, 'facebook', NULL, 0),
(60, 'Cecilia', 'Acosta', 2222222, 'facebook', NULL, 0),
(61, 'Mercedes', 'Correa', 2222222, 'facebook', NULL, 0),
(62, 'Ileana', 'Mastropierro', 2222222, 'facebook', NULL, 0),
(63, 'Vanesa', 'Staldeker', 2222222, 'facebook', NULL, 0),
(64, 'Manuela', 'Piñeyro', 2222222, 'facebook', NULL, 0),
(65, 'Laura', 'Gonzalez Guerra', 2222222, 'facebook', NULL, 0),
(66, 'Daiana', 'Sanchez', 2222222, 'facebook', NULL, 0),
(67, 'Celeste', 'Morrone', 2222222, 'facebook', NULL, 0),
(68, 'Valentina', 'Masson', 2222222, 'facebook', NULL, 0),
(69, 'Ana', 'Span', 2222222, 'facebook', NULL, 0),
(70, 'Valeria', 'Lazarte', 2222222, 'facebook', NULL, 0),
(71, 'Soledad', 'Gomar', 2222222, 'facebook', NULL, 0),
(72, 'Marcela', 'Varela', 2222222, 'facebook', NULL, 0),
(73, 'Carina', 'Sousa', 2222222, 'facebook', NULL, 0),
(74, 'Alejandra', 'Savini', 2222222, 'facebook', NULL, 0),
(75, 'Milagros', 'Alonso', 2222222, 'facebook', NULL, 0),
(76, 'Marina', 'Grondona', 2222222, 'facebook', NULL, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `auth_key` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_reset_token` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `status` smallint(6) NOT NULL DEFAULT '10',
  `created_at` int(11) NOT NULL,
  `updated_at` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `password_reset_token` (`password_reset_token`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=2 ;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `username`, `auth_key`, `password_hash`, `password_reset_token`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', '', NULL, '', 10, 0, 0);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_center` FOREIGN KEY (`IdCenter`) REFERENCES `center` (`Id`),
  ADD CONSTRAINT `appointment_day` FOREIGN KEY (`idDay`) REFERENCES `day` (`id`),
  ADD CONSTRAINT `appointment_patient` FOREIGN KEY (`idPatient`) REFERENCES `patient` (`id`);

--
-- Filtros para la tabla `appointment_area`
--
ALTER TABLE `appointment_area`
  ADD CONSTRAINT `appointment_area_appointment` FOREIGN KEY (`idAppointment`) REFERENCES `appointment` (`id`),
  ADD CONSTRAINT `appointment_area_area` FOREIGN KEY (`idArea`) REFERENCES `area` (`id`);

--
-- Filtros para la tabla `area`
--
ALTER TABLE `area`
  ADD CONSTRAINT `area_center` FOREIGN KEY (`IdCenter`) REFERENCES `center` (`Id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
